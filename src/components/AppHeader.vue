<script setup>
import { ref } from 'vue'
import { useBridgeStore } from '../stores/BridgeStore'
import { useSequenceStore } from '../stores/SequenceStore'
import { version } from "../../package.json"
const { loggedIn, user, clear } = useUserSession()
const bridgeStore = useBridgeStore()
const sequenceStore = useSequenceStore()
const pending = ref(false)
const error = ref('')
async function logout() {
    if (pending.value) return
    pending.value = true
    error.value = ''
    try {
        await clear()
        await navigateTo('/login')
        bridgeStore.$reset()
        sequenceStore.$reset()
    } catch {
        error.value = 'No se pudo cerrar la sesión. Intenta de nuevo.'
    } finally {
        pending.value = false
    }
}
</script>

<template>
    <div class="w-full pt-3">
        <div class="flex justify-center mb-3">
            <p class="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-blue-500 via-purple-500 to-red-500 w-fit underline">Hue Show Creator</p>
            <p class="text-xs flex items-end text-neutral-500 pb-[2px]">Version {{ version }}</p>
        </div>
        <div v-if="loggedIn" class="flex flex-wrap items-center justify-end gap-3 px-4 pb-3 text-sm">
            <span class="break-all text-neutral-600">{{ user.email }}</span>
            <button :disabled="pending" class="text-blue-700 underline disabled:opacity-50" @click="logout">{{ pending ? 'Cerrando…' : 'Cerrar sesión' }}</button>
            <p v-if="error" role="alert" class="text-red-700">{{ error }}</p>
        </div>
        <div class="bg-gradient-to-r from-green-500 via-blue-500 via-purple-500 to-red-500 py-1">
        </div>
    </div>
</template>