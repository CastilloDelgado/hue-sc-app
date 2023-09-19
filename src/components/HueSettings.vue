<script setup>
import { onMounted, ref } from "vue";
import { useBridgeStore } from "../stores/BridgeStore"
import { storeToRefs } from "pinia";
import { createUsername, fetchBridgeSettings } from '../composables/HueServices'
import AppButton from "./AppButton.vue"
import AppLoader from "./AppLoader.vue";

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
            console.log(error)
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
            console.log(error)
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
            <p class="text-sm text-red-500" v-if="errorMessage !== ''">*{{ errorMessage || "Unknown error" }}</p>
            <div class="flex mb-1">
                <p class="mr-2">ID:</p>
                <input class="border-b-[1px] border-neutral-800"  type="text" v-model="id">
                <AppLoader v-if="loadingIdAndIp" />
            </div>
            <div class="flex mb-1">
                <p class="mr-2">IP:</p>
                <input class="border-b-[1px] border-neutral-800" type="text" v-model="ip">
                <AppLoader v-if="loadingIdAndIp" />
            </div>
            <div class="flex mb-3">
                <p class="mr-2">USERNAME:</p>
                <input class="border-b-[1px] border-neutral-800" disabled type="text" v-model="username">
                <AppLoader v-if="loadingUsername" />
            </div>
            <div class="flex">
                <AppButton title="Create Username" class="mr-1" :disabled="id === '' || ip === '' || username !== ''" :action="fetchUsername"/>
                <AppButton title="Save Data" />
            </div>
        </div>
    </div>
</template>