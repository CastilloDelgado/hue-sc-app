import { defineNitroPlugin, useRuntimeConfig } from '#imports'

export default defineNitroPlugin(() => {
  const secret = process.env.NUXT_SESSION_PASSWORD || useRuntimeConfig().session.password
  if (typeof secret !== 'string' || secret.length < 32) {
    throw new Error('Configura NUXT_SESSION_PASSWORD con un secreto aleatorio de al menos 32 caracteres.')
  }
})
