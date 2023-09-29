<script setup>
import { onMounted, ref } from "vue";
import { useBridgeStore } from "../stores/BridgeStore"
import { storeToRefs } from "pinia";
import { createUsername, fetchBridgeSettings } from '../composables/HueServices'
import AppButton from "./AppButton.vue"
import AppInput from "./AppInput.vue";


const bridgeStore = useBridgeStore()
const { id, ip, username } = storeToRefs(bridgeStore)
const loadingIdAndIp = ref(false)
const loadingUsername = ref(false)

const errorMessage = ref('')

const fetchUsername = () => {
    loadingUsername.value = true
    createUsername()
        .then((response) => {
            if(response.data[0].success.username){
                const newUsername = response.data[0].success.username
                bridgeStore.setUsername(newUsername)
                const bridgeSettings = JSON.parse(localStorage.getItem('bridgeSettings'))
                bridgeSettings.username = newUsername
                localStorage.setItem('bridgeSettings', JSON.stringify(bridgeSettings))
            } else {
                errorMessage.value = "Press the bridge button to create username."
            }
        })
        .catch((error) => {
            // console.log(error)
        })
        .then(() => loadingUsername.value = false)
}

const fetchSettings = () => {
    loadingIdAndIp.value = true
    fetchBridgeSettings()
        .then((response) => {
            if(response && response.data && response.data[0]){
                const data = response.data[0]
                bridgeStore.setIdAndIp(data.id, data.internalipaddress)
                localStorage.setItem('bridgeSettings', JSON.stringify({
                    id: data.id,
                    ip: data.internalipaddress
                }))
            }
        })
        .catch((error) => {
            // console.log(error)
            errorMessage.value = `${error.message}, fill data manually!`
        })
        .then(() => loadingIdAndIp.value = false)
}
 
onMounted(() => {
    // Get local storage data
    const bridgeSettingsLocal = localStorage.getItem("bridgeSettings")

    if(bridgeSettingsLocal){
        const bridgeSettings = JSON.parse(bridgeSettingsLocal)

        if(bridgeSettings.id && bridgeSettings.ip){
            bridgeStore.setIdAndIp(bridgeSettings.id, bridgeSettings.ip)
        } 

        if(bridgeSettings.username){
            bridgeStore.setUsername(bridgeSettings.username)
        }
    } else{
        fetchSettings()
    }   
})
</script>

<template>
    <div class="mt-2 mb-6">
        <p class="text-2xl font-bold text-neutral-800 mb-4">Brige Settings</p>
        <div class="pl-4 border-l-2 border-black">
            <p class="text-sm text-red-500 mb-1" v-if="errorMessage !== ''">*{{ errorMessage || "Unknown error" }}</p>
            <p class="text-sm text-blue-500 mb-1" v-if="id && ip && !username">* First press the button of your bridge, then press create username.</p>
            <AppInput v-model="id" title="ID" :loading="loadingIdAndIp"/>
            <AppInput v-model="ip" title="IP" :loading="loadingIdAndIp"/>
            <AppInput v-model="username" title="USERNAME" :loading="loadingUsername"/>
            <div class="flex">
                <AppButton title="Create Username" class="mr-1" :disabled="id === '' || ip === '' || username !== ''" :action="fetchUsername"/>
                <AppButton title="Save Data" />
            </div>
        </div>
    </div>
</template>