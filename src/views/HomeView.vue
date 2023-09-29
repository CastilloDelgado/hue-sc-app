<script setup>
import HueSettings from "@/components/HueSettings.vue"
import LightsSettings from "../components/LightsSettings.vue";
import SequenceCreator from "../components/SequenceCreator.vue";
import { onMounted } from "vue";
import { useSequenceStore } from "../stores/SequenceStore";

const sequencesStore = useSequenceStore()

onMounted(() => {
  const savedSequences = JSON.parse(localStorage.getItem('savedSequences'))
  console.log(savedSequences)
  sequencesStore.sequences = JSON.parse(localStorage.getItem('savedSequences'))
})

</script>

<template>
  <div class="p-4">
    <div class="flex flex-col lg:flex-row">
      <div class="w-full lg:w-1/3 pr-6" >
        <div>
          <p class="text-3xl font-bold text-red-500">Step 1</p>
          <p class="text-xs text-justify mb-1">First, we need to link the app with your bridge, to do this we are trying to automatically detect the IP and ID of your Bridge in your local network. Be sure that you are at the same network that the one your bridge is connected. If we can't find your information, you can provide it manually.</p>
          <p class="text-xs text-justify mb-1">After that, you need to create an username, for that you need to press the button on your bridge and then press "Create Username" button down below.</p>
        </div>
        <HueSettings/>
      </div>
      <div>
        <div  class="w-full lg:w-2/3" >
          <p class="text-3xl font-bold text-red-500">Step 2</p>
          <p class="text-xs text-justify mb-1">After the 1st step is completed, we can test the app by getting all the lights that are linked to your bridge. This should be executed automatically when the username is created or you can execute it manually clicking the "Get Lights" button.</p>
        </div>
        <LightsSettings/>
      </div>
    </div>
    <p class="text-3xl font-bold text-red-500 mb-1">Step 3</p>
    <p class="text-xs text-justify mb-1">This is the sequence creator. First you need to create a sequence, click on the "Create Sequence" button and then fill the form. After that, a new sequence will be shown down below. You can add steps for every light filling the state form. Get creative here and create light shows for you favorite songs!!! (Please notice that the max of request of the bridge are 8 calls per second)</p>
    <SequenceCreator />
  </div>
</template>
