import { defineEventHandler, setHeader } from 'h3'
import { requireUserSession } from '#imports'
import { assertSameOrigin } from '../utils/auth-request'

const publicApiPaths = new Set([
  '/api/health', '/api/auth/login', '/api/auth/register', '/api/_auth/session'
])

export default defineEventHandler(async (event) => {
  const path = event.path.split('?')[0]
  if (path.startsWith('/api/') || ['/', '/login', '/register'].includes(path)) {
    setHeader(event, 'Cache-Control', 'private, no-store')
  }
  if (path === '/api/_auth/session' && event.method === 'DELETE') assertSameOrigin(event)
  if (path.startsWith('/api/') && !publicApiPaths.has(path)) {
    await requireUserSession(event)
  }
})
