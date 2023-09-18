<script setup>
import { onMounted } from 'vue';
import { HueServices } from "../services/HueServices"
import { useBridgeStore } from "../stores/BridgeStore"
import { storeToRefs } from 'pinia';
import LightInfo from './LightInfo.vue'


const bridgeStore = useBridgeStore()
const { lights } = storeToRefs(bridgeStore)


onMounted(() => {   
    HueServices.getLights()
        .then((response) => {
            console.log(response.data)
            const lightsData = Object.entries(response.data).map(([key, lightData]) => ({
                id: parseInt(key),
                ...lightData
            }))

            bridgeStore.setLights(lightsData)
        })
        .catch((error) => {
            console.log(error)
        })
})

</script>

<template>
    <div class="mt-2">
        <p class="text-2xl font-bold text-neutral-800 mb-4">Lights Settings</p>
        <div class="flex overflow-auto">
            <div v-for="light in lights" :key="light.id">
                <LightInfo :light="light" />
            </div>
        </div>
    </div>
</template>