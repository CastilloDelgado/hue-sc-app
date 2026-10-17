import { createError, defineEventHandler } from 'h3'
import { requireUserSession, replaceUserSession, verifyPassword } from '#imports'
import { authDatabase } from '../../utils/auth-database'
import { readCredentials } from '../../utils/auth-request'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const { email, password } = await readCredentials(event)
  const db = authDatabase()
  const stored = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(session.user.id) as { password_hash: string | null } | undefined
  if (!stored?.password_hash || !await verifyPassword(stored.password_hash, password)) {
    throw createError({ statusCode: 401, message: 'La contraseña actual es incorrecta.' })
  }
  const result = db.prepare('UPDATE OR IGNORE users SET email = ? WHERE id = ?').run(email, session.user.id)
  if (!result.changes) {
    throw createError({ statusCode: 409, message: 'No se pudo actualizar el correo. Prueba con otro.' })
  }
  const user = { id: session.user.id, email }
  await replaceUserSession(event, { user })
  return { user }
})
