<script setup>
import HueSettings from "@/components/HueSettings.vue"
import LightsSettings from "../components/LightsSettings.vue";
import SequenceCreator from "../components/SequenceCreator.vue";

</script>

<template>
  <div class="p-4">
    <p class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-blue-500 via-purple-500 to-red-500 mb-6 w-fit underline">Hue Show Creator</p>
    <HueSettings />
    <LightsSettings />
    <SequenceCreator />
  </div>
</template>
