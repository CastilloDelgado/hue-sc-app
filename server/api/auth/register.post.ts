import { randomUUID } from 'node:crypto'
import { createError, defineEventHandler, setResponseStatus } from 'h3'
import { hashPassword, replaceUserSession } from '#imports'
import { authDatabase } from '../../utils/auth-database'
import { readCredentials } from '../../utils/auth-request'

export default defineEventHandler(async (event) => {
  const { email, password } = await readCredentials(event, true)
  const passwordHash = await hashPassword(password)
  const user = { id: randomUUID(), email }
  const result = authDatabase().prepare(`
    INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)
    ON CONFLICT(email) DO NOTHING
  `).run(user.id, email, passwordHash)
  if (!result.changes) {
    throw createError({ statusCode: 409, message: 'No se pudo crear la cuenta con este correo. Intenta iniciar sesión.' })
  }
  await replaceUserSession(event, { user })
  setResponseStatus(event, 201)
  return { user }
})
