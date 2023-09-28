<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  Switch,
} from '@headlessui/vue'
import AppButton from './AppButton.vue';
import { ref, watch } from 'vue';
import { useSequenceStore } from '../stores/SequenceStore';
import { storeToRefs } from 'pinia';
import { hexToXy } from "../helpers"

const sequenceStore = useSequenceStore()
const { stepSelected } = storeToRefs(sequenceStore)

const state = ref('')
const color = ref('')
const bri = ref(0)
const isOn = ref(false)

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    openModal: {
        type: Function,
        required: true
    }, 
    closeModal: {
        type: Function,
        required: true
    }
})

const saveState = (newState) => {
  sequenceStore.updateStepState(newState)
  props.closeModal()
}

watch(stepSelected, () => {
  state.value = sequenceStore.getState()
})

const cleanState = () => state.value = ""

watch(color, () => {
  if(state.value === ""){
    state.value = "{}"
    const stateObject = JSON.parse(state.value)
    stateObject.xy = hexToXy(color.value)
    state.value = JSON.stringify(stateObject)
  } else {
    const stateObject = JSON.parse(state.value)
    stateObject.xy = hexToXy(color.value)
    state.value = JSON.stringify(stateObject)
  }
})

watch(isOn, () => {
  if(state.value === ""){
    state.value = "{}"
    const stateObject = JSON.parse(state.value)
    stateObject.on = isOn.value
    state.value = JSON.stringify(stateObject)
  } else {
    const stateObject = JSON.parse(state.value)
    stateObject.on = isOn.value
    state.value = JSON.stringify(stateObject)
  }
})

watch(bri, () => {
  if(state.value === ""){
    state.value = "{}"
    const stateObject = JSON.parse(state.value)
    stateObject.bri = Number(bri.value)
    state.value = JSON.stringify(stateObject)
  } else {
    const stateObject = JSON.parse(state.value)
    stateObject.bri = Number(bri.value)
    state.value = JSON.stringify(stateObject)
  }
})

</script>

<template>
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>
  
        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden border-2 border-black bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                  as="h3"
                  class="text-xl font-bold leading-6 text-gray-900 mb-6"
                >
                  Light State
                </DialogTitle>
                <div class="mb-6">
                    <!-- On/Off -->
                    <div>
                      <b class="mr-2" >On: </b>
                      <Switch
                      v-model="isOn"
                      :class="`${isOn ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`"
                      >
                      <span :class="`${isOn ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`" />
                    </Switch>
                  </div>
                  <!--  BRI -->
                    <div>
                      <b class="mr-2" >Bri: </b>
                      <input v-model="bri" type="range" min="0" max="254" />
                    </div>
                    <!-- Color Picker -->
                    <div class="flex mb-1">
                      <b class="mr-2" >Color: </b>
                      <input type="color" class="w-full" v-model="color"> 
                    </div>
                    <div class="flex mb-2">
                      <b class="mr-2">State:</b>
                      <textarea v-model="state" class="p-1 w-full border-[1px] border-black" />
                    </div>
                      <!-- Clean state -->
                    <div class="w-full flex justify-end">
                      <AppButton title="Clean state" class="w-fit bg-yellow-500 border-yellow-500 hover:border-black" @click="cleanState" />
                    </div>
                  </div>
                <div class="mt-4 w-full flex justify-between">
                  <AppButton title="Save" :action="() => saveState(state)"/>
                  <AppButton title="Close" :action="closeModal" class="bg-red-500 border-red-500 text-white active:bg-red-500 active:border-red-500 active:text-red-500" />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
</template>
