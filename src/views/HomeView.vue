<script setup>
import HueSettings from "@/components/HueSettings.vue"
import LightsSettings from "../components/LightsSettings.vue";
import SequenceCreator from "../components/SequenceCreator.vue";

</script>

<template>
  <div class="p-4">
    <div class="flex flex-col md:flex-row">
      <HueSettings class="w-full md:w-1/3" />
      <LightsSettings class="w-full md:w-2/3" />
    </div>
    <SequenceCreator />
  </div>
</template>
