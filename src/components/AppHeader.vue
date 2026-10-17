<script setup>
import { version } from '../../package.json'
</script>

<template>
  <header class="w-full pt-3">
    <div class="flex flex-wrap items-baseline justify-center gap-1 mb-3">
      <p class="text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-blue-500 via-purple-500 to-red-500 w-fit underline">Hue Show Creator</p>
      <p class="text-xs text-neutral-500">Version {{ version }}</p>
    </div>
    <div class="bg-gradient-to-r from-green-500 via-blue-500 via-purple-500 to-red-500 h-1" />
  </header>
</template>
