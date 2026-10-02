import { createHash } from 'node:crypto'
import { createError, getHeader, getRequestIP, getRequestURL, readRawBody, setHeader, type H3Event } from 'h3'
import { authDatabase } from './auth-database'

export function assertSameOrigin(event: H3Event) {
  const origin = getHeader(event, 'origin')
  // Non-browser clients may omit Origin. Browser requests must be same-origin.
  if ((origin && origin !== getRequestURL(event).origin) || getHeader(event, 'sec-fetch-site') === 'cross-site') {
    throw createError({ statusCode: 403, message: 'Solicitud no permitida.' })
  }
}

export function limitAuthAttempts(event: H3Event, scope: string, identifier: string, limit: number, windowSeconds = 900) {
  const now = Date.now()
  const db = authDatabase()
  db.prepare('DELETE FROM auth_attempts WHERE expires_at <= ?').run(now)
  const key = createHash('sha256').update(`${scope}:${identifier}`).digest('hex')
  const record = db.prepare(`
    INSERT INTO auth_attempts (key, attempts, expires_at) VALUES (?, 1, ?)
    ON CONFLICT(key) DO UPDATE SET attempts = attempts + 1
    RETURNING attempts, expires_at
  `).get(key, now + windowSeconds * 1000) as { attempts: number, expires_at: number }
  if (record.attempts > limit) {
    setHeader(event, 'Retry-After', Math.ceil((record.expires_at - now) / 1000))
    throw createError({ statusCode: 429, message: 'Demasiados intentos. Intenta de nuevo más tarde.' })
  }
}

export async function readCredentials(event: H3Event, registration = false) {
  assertSameOrigin(event)
  limitAuthAttempts(event, registration ? 'register-ip' : 'login-ip', getRequestIP(event) || 'unknown', registration ? 10 : 30)
  if (!getHeader(event, 'content-type')?.startsWith('application/json')) {
    throw createError({ statusCode: 415, message: 'Se requiere JSON.' })
  }
  if (Number(getHeader(event, 'content-length')) > 8192) {
    throw createError({ statusCode: 413, message: 'Solicitud demasiado grande.' })
  }
  const raw = await readRawBody(event)
  if (!raw || Buffer.byteLength(raw) > 8192) {
    throw createError({ statusCode: 400, message: 'Datos inválidos.' })
  }
  let body
  try { body = JSON.parse(raw) } catch {
    throw createError({ statusCode: 400, message: 'Datos inválidos.' })
  }
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = body?.password
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: 'Ingresa un correo válido.' })
  }
  if (typeof password !== 'string' || password.length < (registration ? 12 : 1) || password.length > 128) {
    throw createError({ statusCode: 400, message: 'La contraseña debe tener entre 12 y 128 caracteres.' })
  }
  if (!registration) limitAuthAttempts(event, 'login-email', email, 10)
  return { email, password }
}
