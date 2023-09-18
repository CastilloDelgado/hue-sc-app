<script setup>
import { onMounted } from 'vue';
import { HueServices } from "../services/HueServices"


onMounted(() => {   
    HueServices.getLights()
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
})

</script>

<template>
    <div class="mt-2">
        <p class="text-2xl font-bold text-neutral-800 mb-4">Lights Settings</p>
    </div>
</template>