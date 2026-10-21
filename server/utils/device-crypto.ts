import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto'
import { useRuntimeConfig } from '#imports'

function key() {
  const secret = process.env.NUXT_SESSION_PASSWORD || useRuntimeConfig().session.password
  if (typeof secret !== 'string' || secret.length < 32) throw new Error('Falta el secreto de cifrado de dispositivos.')
  return Buffer.from(hkdfSync('sha256', secret, 'hue-devices-v1', 'credential-encryption', 32))
}
export function encryptCredential(value: string, owner: string, bridge: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(), iv)
  cipher.setAAD(Buffer.from(JSON.stringify([owner, bridge])))
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  return ['v1', iv.toString('base64'), cipher.getAuthTag().toString('base64'), encrypted.toString('base64')].join('.')
}
export function decryptCredential(value: string, owner: string, bridge: string) {
  const [version, iv, tag, content] = value.split('.')
  if (version !== 'v1') throw new Error('Formato de credencial inválido.')
  const cipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64'))
  cipher.setAAD(Buffer.from(JSON.stringify([owner, bridge])))
  cipher.setAuthTag(Buffer.from(tag, 'base64'))
  return Buffer.concat([cipher.update(Buffer.from(content, 'base64')), cipher.final()]).toString('utf8')
}
