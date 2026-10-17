<script setup>
import { onMounted, ref } from 'vue';
import { useBridgeStore } from "../stores/BridgeStore"
import { storeToRefs } from 'pinia';
import LightInfo from './LightInfo.vue'
import AppButton from './AppButton.vue';
import AppLoader from './AppLoader.vue';
import { getLights } from '../composables/HueServices';

const bridgeStore = useBridgeStore()
const { id, ip, username, lights } = storeToRefs(bridgeStore)
const loading = ref(false)

const fetchLights = () => {
    loading.value = true
    getLights()
        .then((response) => {
            const lightsData = Object.entries(response.data).map(([key, lightData]) => ({
                id: parseInt(key),
                ...lightData
            }))

            bridgeStore.setLights(lightsData)
        })
        .catch((error) => {
            // console.log(error)
        })
        .then(() => {
            loading.value = false
        })
}


onMounted(() => {   
    if(ip.value && username.value){
        fetchLights()
    }
})

</script>

<template>
    <div class="mt-2 mb-6">
        <p class="text-2xl font-bold text-blue-400 mb-4">Luces del bridge</p>
        <div class="pl-4 border-l-2 border-black">
            <div class="mb-2 flex">
                <AppButton title="Obtener luces" :action="fetchLights" :disabled="!ip || !username || loading" />
                <AppLoader class="text-red-500 ml-2" v-if="loading"/>
            </div>
            <div class="flex overflow-auto">
                <div v-for="light in lights" :key="light.id">
                    <LightInfo :light="light" />
                </div>
            </div>
        </div>
    </div>
</template>
