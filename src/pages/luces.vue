<script setup>
import { useBridgeStore } from "../stores/BridgeStore"
useHead({ title: 'Luces · Hue Show Creator' })
const bridge = useBridgeStore()
</script>

<template>
  <section class="dashboard-section">
    <p class="text-sm text-neutral-400 mb-2">Paso 2</p>
    <h1 class="text-3xl font-bold text-blue-400 mb-3">Luces</h1>
    <p class="text-neutral-300 mb-8">Consulta las luces vinculadas a tu bridge para usarlas en tus animaciones.</p>
    <p v-if="!bridge.ip || !bridge.username" class="mb-6 text-neutral-300">Primero configura la <NuxtLink to="/" class="text-blue-400 underline">conexión HUE Bridge</NuxtLink>.</p>
    <LightsSettings />
  </section>
</template>
