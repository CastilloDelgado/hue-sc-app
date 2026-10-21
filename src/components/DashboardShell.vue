<script setup>
import { useBridgeStore } from '../stores/BridgeStore'
import { useSequenceStore } from '../stores/SequenceStore'

const { user, clear } = useUserSession()
const route = useRoute()
const bridge = useBridgeStore()
const sequences = useSequenceStore()
const storage = useAccountStorage()
const pending = ref(false)
const error = ref('')
const menuOpen = ref(false)
const links = [
  { to: '/', label: 'Conexión HUE Bridge', number: '01' },
  { to: '/luces', label: 'Luces', number: '02' },
  { to: '/animaciones', label: 'Animaciones', number: '03' }
]
watch(() => route.path, () => { menuOpen.value = false })

onMounted(async () => {
  const saved = storage.read('savedSequences', [])
  sequences.sequences = Array.isArray(saved) ? saved : []
  try {
    const result = await $fetch('/api/devices')
    bridge.devices = result.devices
    const settings = result.devices[0] || storage.read('bridgeSettings', {})
    bridge.setIdAndIp(settings.bridgeId || settings.id || '', settings.ip || '')
    bridge.setUsername(settings.username || '')
  } catch {
    error.value = 'No pudimos cargar tus bridges. Recarga la página para intentar de nuevo.'
  } finally { bridge.devicesLoaded = true }
})

async function logout() {
  if (pending.value) return
  pending.value = true
  error.value = ''
  try {
    await clear()
    bridge.$reset()
    sequences.$reset()
    await navigateTo('/login')
  } catch {
    error.value = 'No se pudo cerrar la sesión. Intenta de nuevo.'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="main-theme dashboard-shell min-h-screen bg-black text-neutral-100">
    <div class="md:hidden flex items-center justify-between border-b border-neutral-800 p-4">
      <span class="font-bold text-blue-400">Hue Show Creator</span>
      <button class="text-blue-400" :aria-expanded="menuOpen" aria-controls="dashboard-sidebar" @click="menuOpen = !menuOpen">{{ menuOpen ? 'Cerrar menú' : 'Menú' }}</button>
    </div>
    <aside id="dashboard-sidebar" class="dashboard-sidebar" :class="{ 'is-open': menuOpen }">
      <div class="px-5 pt-5 pb-8"><AppHeader /></div>
      <nav aria-label="Navegación principal" class="space-y-2 px-4">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="dashboard-link" :class="{ 'is-active': route.path === link.to }" :aria-current="route.path === link.to ? 'page' : undefined">
          <span class="text-xs opacity-60">{{ link.number }}</span>{{ link.label }}
        </NuxtLink>
      </nav>
      <div class="mt-auto p-4 space-y-3 border-t border-neutral-800">
        <p class="text-xs text-neutral-400 break-all px-3">{{ user?.email }}</p>
        <NuxtLink to="/perfil" class="dashboard-link" :class="{ 'is-active': route.path === '/perfil' }" :aria-current="route.path === '/perfil' ? 'page' : undefined">Perfil</NuxtLink>
        <button class="w-full rounded-md bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50" :disabled="pending" @click="logout">{{ pending ? 'Cerrando…' : 'Cerrar sesión' }}</button>
        <p v-if="error" role="alert" class="text-sm text-red-400">{{ error }}</p>
      </div>
    </aside>
    <main class="dashboard-content min-w-0"><slot /></main>
  </div>
</template>
