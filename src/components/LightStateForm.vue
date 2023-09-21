<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
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

watch(color, () => {
  const stateObject = JSON.parse(state.value)
  stateObject.xy = hexToXy(color.value)
  state.value = JSON.stringify(stateObject)
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
                    <!-- Color Picker -->
                    <div class="flex mb-1">
                      <b class="mr-2" >Color: </b>
                      <input type="color" class="w-full" v-model="color"> 
                    </div>
                    <div class="flex">
                      <b class="mr-2">State:</b>
                      <textarea v-model="state" class="p-1 w-full border-[1px] border-black" />
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
