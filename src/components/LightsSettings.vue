<script setup>
import { watch, ref } from 'vue';
import { useBridgeStore } from "../stores/BridgeStore"
import { storeToRefs } from 'pinia';
import LightInfo from './LightInfo.vue'
import AppButton from './AppButton.vue';
import AppLoader from './AppLoader.vue';
import { getLights } from '../composables/HueServices';

const bridgeStore = useBridgeStore()
const { ip, username, lights } = storeToRefs(bridgeStore)
const loading = ref(false)

const error = ref('')
let latestRequest = 0
const fetchLights = async () => {
    const request = ++latestRequest
    loading.value = true
    error.value = ''
    bridgeStore.setLights([])
    try {
        const { data } = await getLights()
        if (request !== latestRequest) return
        if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error('El bridge rechazó el acceso. Comprueba la conexión en Hue Bridge.')
        bridgeStore.setLights(Object.entries(data).map(([key, light]) => ({ ...light, id: Number(key) })))
    } catch (failure) {
        if (request === latestRequest) error.value = failure.isAxiosError ? 'No pudimos cargar las luces. Comprueba que estés en la red del bridge e intenta de nuevo.' : failure.message
    } finally {
        if (request === latestRequest) loading.value = false
    }
}

watch([ip, username], () => {
    if (ip.value && username.value) fetchLights()
    else { latestRequest++; loading.value = false; bridgeStore.setLights([]) }
}, { immediate: true })

</script>

<template>
    <div class="mt-2 mb-6">
        <p class="text-2xl font-bold text-blue-400 mb-4">Luces del bridge</p>
        <div class="pl-4 border-l-2 border-black">
            <div class="mb-2 flex">
                <AppButton title="Obtener luces" :action="fetchLights" :disabled="!ip || !username || loading" />
                <AppLoader class="text-red-500 ml-2" v-if="loading"/>
            </div>
            <p v-if="error" role="alert" class="text-red-400 mb-3">{{ error }}</p>
            <div class="flex overflow-auto">
                <div v-for="light in lights" :key="light.id">
                    <LightInfo :light="light" />
                </div>
            </div>
        </div>
    </div>
</template>
