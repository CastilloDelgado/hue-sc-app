import { createError, defineEventHandler } from 'h3'
import { hashPassword, replaceUserSession, verifyPassword } from '#imports'
import { findUserByEmail } from '../../utils/auth-database'
import { readCredentials } from '../../utils/auth-request'

let dummyHash: Promise<string>

export default defineEventHandler(async (event) => {
  const { email, password } = await readCredentials(event)
  const stored = findUserByEmail(email)
  dummyHash ||= hashPassword('unused-password-for-timing-comparison')
  const valid = await verifyPassword(stored?.password_hash || await dummyHash, password)
  if (!stored?.password_hash || !valid) {
    throw createError({ statusCode: 401, message: 'Correo o contraseña incorrectos.' })
  }
  const user = { id: stored.id, email: stored.email }
  await replaceUserSession(event, { user })
  return { user }
})
