<script setup>
import { onMounted, ref } from 'vue';
import { HueServices } from "../services/HueServices"
import { useBridgeStore } from "../stores/BridgeStore"
import { storeToRefs } from 'pinia';
import LightInfo from './LightInfo.vue'
import AppButton from './AppButton.vue';
import AppLoader from './AppLoader.vue';

const bridgeStore = useBridgeStore()
const { lights } = storeToRefs(bridgeStore)
const loading = ref(false)

const fetchLights = () => {
    loading.value = true
    HueServices.getLights()
        .then((response) => {
            const lightsData = Object.entries(response.data).map(([key, lightData]) => ({
                id: parseInt(key),
                ...lightData
            }))

            bridgeStore.setLights(lightsData)
        })
        .catch((error) => {
            console.log(error)
        })
        .then(() => {
            loading.value = false
        })
}


onMounted(() => {   
    fetchLights()
})

</script>

<template>
    <div class="mt-2">
        <p class="text-2xl font-bold text-neutral-800 mb-4">Lights Settings</p>
        <div class="mb-2 flex">
            <AppButton title="Get lights" :action="fetchLights"  />
            <AppLoader class="text-red-500 ml-2" v-if="!loading"/>
        </div>
        <div class="flex overflow-auto">
            <div v-for="light in lights" :key="light.id">
                <LightInfo :light="light" />
            </div>
        </div>
    </div>
</template>