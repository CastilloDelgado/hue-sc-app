import { randomUUID } from 'node:crypto'
import { isIP } from 'node:net'
import { createError, defineEventHandler, getHeader, readRawBody } from 'h3'
import { requireUserSession } from '#imports'
import { authDatabase } from '../../utils/auth-database'
import { assertSameOrigin } from '../../utils/auth-request'
import { encryptCredential } from '../../utils/device-crypto'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  assertSameOrigin(event)
  if (!getHeader(event, 'content-type')?.startsWith('application/json')) throw createError({ statusCode: 415, message: 'Se requiere JSON.' })
  if (Number(getHeader(event, 'content-length')) > 4096) throw createError({ statusCode: 413, message: 'Datos demasiado grandes.' })
  const raw = await readRawBody(event)
  if (!raw || Buffer.byteLength(raw) > 4096) throw createError({ statusCode: 400, message: 'Datos inválidos.' })
  let body
  try { body = JSON.parse(raw) } catch { throw createError({ statusCode: 400, message: 'Datos inválidos.' }) }
  const bridgeId = typeof body?.bridgeId === 'string' ? body.bridgeId.toUpperCase() : ''
  const ip = typeof body?.ip === 'string' ? body.ip.trim() : ''
  const name = typeof body?.name === 'string' ? body.name.trim() : 'Hue Bridge'
  const username = body?.username
  if (!/^[A-F0-9]{16}$/.test(bridgeId) || isIP(ip) !== 4 || !name || name.length > 80 || typeof username !== 'string' || !/^[A-Za-z0-9_-]{10,128}$/.test(username)) {
    throw createError({ statusCode: 400, message: 'Datos del bridge inválidos.' })
  }
  const db = authDatabase()
  db.prepare(`INSERT INTO devices (id, user_id, bridge_id, name, ip, credential) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, bridge_id) DO UPDATE SET name = excluded.name, ip = excluded.ip,
    credential = excluded.credential, updated_at = CURRENT_TIMESTAMP, last_connected_at = CURRENT_TIMESTAMP`)
    .run(randomUUID(), user.id, bridgeId, name, ip, encryptCredential(username, user.id, bridgeId))
  const device = db.prepare('SELECT id, bridge_id AS bridgeId, name, ip FROM devices WHERE user_id = ? AND bridge_id = ?').get(user.id, bridgeId)
  return { device }
})
