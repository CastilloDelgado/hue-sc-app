import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: 'src/',
  serverDir: 'server/',
  modules: ['@pinia/nuxt', 'nuxt-auth-utils'],
  runtimeConfig: {
    authDatabasePath: '.data/auth.sqlite',
    session: {
      name: 'hue-session',
      maxAge: 60 * 60 * 24 * 7,
      cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }
    }
  },
  css: ['~/assets/style.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  app: {
    head: {
      title: 'Hue Show Creator',
      htmlAttrs: { lang: 'en' },
      bodyAttrs: { class: 'bg-black' },
      link: [{ rel: 'icon', href: '/favicon.ico' }]
    }
  },
  nitro: {
    preset: 'node-server',
    unenv: { external: ['node:sqlite'] }
  }
})
