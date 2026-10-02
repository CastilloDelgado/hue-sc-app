export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, ready, fetch } = useUserSession()
  if (!ready.value) await fetch()
  const guestPage = ['/login', '/register'].includes(to.path)
  if (!loggedIn.value && !guestPage) return navigateTo('/login')
  if (loggedIn.value && guestPage) return navigateTo('/')
})
