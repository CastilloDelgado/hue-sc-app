<script setup>
/* global $fetch */
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useBridgeStore } from '../stores/BridgeStore'
import { createUsername, fetchBridgeSettings, getBridgeConfig, inspectBridge } from '../composables/HueServices'
import { useAccountStorage } from '../composables/useAccountStorage'
import { HUE_DISCOVER_URL } from '../../constants'

const storage = useAccountStorage()
const bridge = useBridgeStore()
const { id, ip, username, devices } = storeToRefs(bridge)
const busy = ref(false)
const status = ref('')
const error = ref('')
const connected = ref(false)
const deviceName = ref('Hue Bridge')
const saveError = ref('')
const candidates = ref([])
const validIp = computed(() => /^(\d{1,3}\.){3}\d{1,3}$/.test(ip.value.trim()) && ip.value.trim().split('.').every(part => Number(part) <= 255))
const persist = () => storage.write('bridgeSettings', { id: id.value, ip: ip.value, username: username.value })
watch(ip, () => { connected.value = false; status.value = '' }, { flush: 'sync' })
function selectBridge(candidate) {
  if (id.value !== candidate.id || (ip.value !== candidate.internalipaddress && !id.value)) {
    username.value = ''
    bridge.setLights([])
  }
  bridge.setIdAndIp(candidate.id, candidate.internalipaddress)
  connected.value = false
  persist()
  status.value = 'Bridge encontrado. Pulsa su botón físico y después «Conectar».'
}
async function saveToAccount() {
  saveError.value = ''
  try {
    await $fetch('/api/devices', { method: 'POST', body: {
      bridgeId: id.value, ip: ip.value, username: username.value, name: deviceName.value
    } })
    const result = await $fetch('/api/devices')
    devices.value = result.devices
    storage.remove('bridgeSettings')
  } catch {
    saveError.value = 'La conexión funciona, pero no pudimos guardar el bridge en tu cuenta. Pulsa «Comprobar conexión» para reintentar.'
  }
}
async function chooseSaved(device) {
  if (busy.value) return
  busy.value = true
  error.value = ''
  saveError.value = ''
  connected.value = false
  bridge.setLights([])
  bridge.setIdAndIp(device.bridgeId, device.ip)
  username.value = device.username
  deviceName.value = device.name
  try { await verifySaved() } catch (failure) { error.value = failure.isAxiosError ? networkError() : failure.message }
  finally { busy.value = false }
}
function editIp(value) {
  ip.value = value
  bridge.setLights([])
  error.value = ''
  saveError.value = ''
}
function networkError() {
  return 'No pudimos comunicarnos con el bridge. Comprueba la IP, que estés en su misma red y que el navegador permita el acceso a la red local. Una web HTTPS también puede bloquear las solicitudes HTTP al bridge.'
}
async function verifySaved() {
  const { data } = await getBridgeConfig()
  if (Array.isArray(data) || !data?.bridgeid) throw new Error('La credencial no es válida. Vuelve a vincular el bridge con su botón físico.')
  if (id.value && id.value.toLowerCase() !== data.bridgeid.toLowerCase()) throw new Error('La IP corresponde a otro bridge. Vuelve a buscar antes de conectarte.')
  id.value = data.bridgeid
  persist()
  connected.value = true
  await saveToAccount()
  status.value = 'Conectado. Ya puedes continuar a Luces.'
}
async function discover() {
  if (busy.value) return
  busy.value = true
  error.value = ''
  status.value = 'Buscando bridges…'
  candidates.value = []
  try {
    const { data } = await fetchBridgeSettings()
    candidates.value = Array.isArray(data) ? data.filter(item => item.id && item.internalipaddress) : []
    const saved = candidates.value.find(item => item.id.toLowerCase() === id.value.toLowerCase())
    if (saved || candidates.value.length === 1) {
      selectBridge(saved || candidates.value[0])
      if (username.value) await verifySaved()
    } else {
      status.value = candidates.value.length ? 'Selecciona el bridge que quieres usar.' : 'No encontramos bridges. Puedes volver a buscar o introducir la IP manualmente.'
    }
  } catch (failure) {
    status.value = ''
    error.value = failure.response?.status === 429
      ? 'Hue Discovery recibió demasiadas solicitudes. Espera unos minutos o introduce la IP manualmente.'
      : failure.isAxiosError
        ? 'No pudimos consultar Hue Discovery o acceder al bridge. Puedes abrir el enlace de búsqueda manual, copiar la IP y conectar. Comprueba también los permisos de red local del navegador.'
        : failure.message
  } finally { busy.value = false }
}
async function connect() {
  if (busy.value || !validIp.value) return
  busy.value = true
  error.value = ''
  status.value = ''
  connected.value = false
  ip.value = ip.value.trim()
  try {
    if (username.value) {
      try { await verifySaved(); return } catch (failure) {
        if (!failure.message?.startsWith('La credencial')) throw failure
        username.value = ''
        persist()
      }
    }
    const info = await inspectBridge()
    if (!info.data?.bridgeid) throw new Error('La dirección no responde como un Hue Bridge.')
    if (id.value && id.value.toLowerCase() !== info.data.bridgeid.toLowerCase()) bridge.setLights([])
    id.value = info.data.bridgeid
    const { data } = await createUsername()
    const hueError = data?.find?.(item => item.error)?.error
    if (hueError) throw new Error(hueError.type === 101 ? 'Pulsa el botón físico del bridge y vuelve a presionar «Conectar».' : 'El bridge rechazó la vinculación. Intenta de nuevo.')
    const credential = data?.find?.(item => item.success?.username)?.success.username
    if (!credential) throw new Error('El bridge no devolvió una credencial válida.')
    username.value = credential
    persist()
    await verifySaved()
  } catch (failure) {
    error.value = failure.isAxiosError ? networkError() : failure.message
  } finally { busy.value = false }
}
onMounted(async () => {
  if (!bridge.devicesLoaded) await new Promise(resolve => {
    const stop = watch(() => bridge.devicesLoaded, loaded => { if (loaded) { stop(); resolve() } })
  })
  const savedDevice = devices.value.find(device => device.bridgeId === id.value)
  deviceName.value = savedDevice?.name || 'Hue Bridge'
  if (validIp.value && username.value) {
    busy.value = true
    try { await verifySaved(); return } catch { /* Rediscover a bridge whose IP changed. */ }
    finally { busy.value = false }
  }
  await discover()
})
</script>

<template>
  <div class="mt-2 mb-6 max-w-xl space-y-5" :aria-busy="busy">
    <h2 class="text-2xl font-bold text-blue-400">Configuración del bridge</h2>
    <p class="text-neutral-300">Buscamos desde este dispositivo. Debes estar conectado a la misma red que tu Hue Bridge.</p>
    <div v-if="devices.length" class="space-y-2">
      <label for="saved-bridge" class="block font-semibold">Bridges de tu cuenta</label>
      <select id="saved-bridge" class="w-full border rounded px-3 py-2" :disabled="busy" :value="id" @change="chooseSaved(devices.find(device => device.bridgeId === $event.target.value))">
        <option value="" disabled>Selecciona un bridge</option>
        <option v-for="device in devices" :key="device.id" :value="device.bridgeId">{{ device.name }} · {{ device.ip }}</option>
      </select>
      <button type="button" class="text-blue-400 underline" :disabled="busy" @click="bridge.setIdAndIp('', ''); username = ''; connected = false; bridge.setLights([]); status = ''; saveError = ''; deviceName = 'Hue Bridge'">Agregar otro bridge</button>
    </div>
    <div>
      <label for="bridge-name" class="block font-semibold mb-2">Nombre del bridge</label>
      <input id="bridge-name" v-model="deviceName" maxlength="80" :disabled="busy" class="w-full border rounded px-3 py-2" />
    </div>
    <button type="button" class="hue-action" :disabled="busy" @click="discover">{{ busy ? 'Un momento…' : 'Buscar bridges' }}</button>
    <div v-if="candidates.length > 1" class="space-y-2">
      <p>Selecciona tu bridge:</p>
      <button v-for="candidate in candidates" :key="candidate.id" type="button" class="hue-action block" :disabled="busy" @click="selectBridge(candidate)">{{ candidate.id }} · {{ candidate.internalipaddress }}</button>
    </div>
    <div>
      <label for="bridge-ip" class="block font-semibold mb-2">IP del Hue Bridge</label>
      <input id="bridge-ip" :value="ip" @input="editIp($event.target.value)" type="text" inputmode="decimal" autocomplete="off" placeholder="192.168.1.100" :disabled="busy" class="w-full border border-neutral-600 rounded px-3 py-2" />
      <p class="text-sm text-neutral-400 mt-2">Se completa automáticamente. También puedes introducirla manualmente.</p>
    </div>
    <p v-if="id" class="text-sm text-neutral-400 break-all">ID del bridge: {{ id }}</p>
    <p class="text-sm text-neutral-300">¿Prefieres buscar los datos manualmente? <a :href="HUE_DISCOVER_URL" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">Abrir Hue Discovery ↗</a></p>
    <p v-if="!connected" class="text-neutral-300">Para vincularlo por primera vez, pulsa el botón físico del bridge y después «Conectar». El bridge y su credencial se guardan en tu cuenta para usarlos en otros dispositivos de esta red.</p>
    <button type="button" class="hue-action" :disabled="busy || !validIp" @click="connect">{{ connected ? 'Comprobar conexión' : 'Conectar' }}</button>
    <p v-if="status" role="status" class="text-blue-400">{{ status }}</p>
    <p v-if="saveError" role="alert" class="text-red-400">{{ saveError }}</p>
    <p v-if="connected && !saveError" class="text-green-400">Bridge guardado en tu cuenta.</p>
    <p v-if="error" role="alert" class="text-red-400">{{ error }}</p>
    <NuxtLink v-if="connected" to="/luces" class="inline-block text-blue-400 underline">Continuar a Luces →</NuxtLink>
  </div>
</template>
