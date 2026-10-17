<script setup>
import { useBridgeStore } from "../stores/BridgeStore"
useHead({ title: 'Animaciones · Hue Show Creator' })
const bridge = useBridgeStore()
</script>

<template>
  <section class="dashboard-section">
    <p class="text-sm text-neutral-400 mb-2">Paso 3</p>
    <h1 class="text-3xl font-bold text-blue-400 mb-3">Animaciones</h1>
    <p class="text-neutral-300 mb-8">Crea una secuencia, selecciona las luces y añade pasos para diseñar tu show. Guarda tus secuencias para volver a usarlas en este navegador.</p>
    <p v-if="!bridge.lights.length" class="mb-6 text-neutral-300">Carga tus luces desde <NuxtLink to="/luces" class="text-blue-400 underline">Luces</NuxtLink> para crear nuevas animaciones.</p>
    <SequenceCreator />
  </section>
</template>
