import { defineEventHandler } from 'h3'
import { requireUserSession } from '#imports'
import { authDatabase } from '../../utils/auth-database'
import { decryptCredential } from '../../utils/device-crypto'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const rows = authDatabase().prepare('SELECT * FROM devices WHERE user_id = ? ORDER BY updated_at DESC, id').all(user.id)
  return { devices: rows.map(row => ({
    id: row.id, bridgeId: row.bridge_id, name: row.name, ip: row.ip,
    username: decryptCredential(String(row.credential), user.id, String(row.bridge_id)),
    createdAt: row.created_at, lastConnectedAt: row.last_connected_at
  })) }
})
