export function useAccountStorage() {
  const { user } = useUserSession()
  const ownerId = user.value?.id
  const keyFor = (name) => {
    if (!ownerId) throw new Error('Debes iniciar sesión.')
    return `hue:${ownerId}:${name}`
  }
  return {
    read(name, fallback = null) {
      try {
        return JSON.parse(localStorage.getItem(keyFor(name))) ?? fallback
      } catch {
        return fallback
      }
    },
    remove(name) {
      localStorage.removeItem(keyFor(name))
    },
    write(name, value) {
      localStorage.setItem(keyFor(name), JSON.stringify(value))
    }
  }
}
