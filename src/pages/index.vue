<script setup>
useHead({ title: 'Conexión HUE Bridge · Hue Show Creator' })
</script>

<template>
  <section class="dashboard-section">
    <p class="text-sm text-neutral-400 mb-2">Paso 1</p>
    <h1 class="text-3xl font-bold text-blue-400 mb-3">Conexión HUE Bridge</h1>
    <p class="text-neutral-300 mb-2">Conecta tu bridge a la misma red que este dispositivo. Intentaremos detectarlo automáticamente; también puedes introducir sus datos manualmente.</p>
    <p class="text-neutral-300 mb-8">Para vincularlo, pulsa el botón físico del bridge y después «Conectar».</p>
    <HueSettings />
  </section>
</template>
