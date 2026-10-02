import { defineEventHandler } from 'h3'

export default defineEventHandler(() => ({
  status: 'ok',
  service: 'hue-sc-app'
}))
