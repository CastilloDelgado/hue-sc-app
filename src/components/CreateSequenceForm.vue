<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import AppButton from './AppButton.vue';
import AppInput from './AppInput.vue';
import { ref } from 'vue';
import { useBridgeStore } from '../stores/BridgeStore';
import { storeToRefs } from 'pinia';

const bridgeStore = useBridgeStore()
const { lights } = storeToRefs(bridgeStore)

const name = ref('')
const bpm = ref('')
const lightsSelected = ref([])

defineProps({
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
                  class="text-xl mb-6 font-bold leading-6 text-gray-900"
                >
                    Create Sequence
                </DialogTitle>
                <div class="mb-6">
                    <AppInput title="Name" v-model="name"/>
                    <AppInput title="BPM" v-model="bpm"/>
                    <p class="text-xs">*Press and hold command while selecting for multiple selection</p>
                    <div class="flex">
                        <div class="w-1/3">
                            <b>Select Lights: </b>
                        </div>
                        <select multiple class="w-2/3 flex border-[1px] border-black" v-model="lightsSelected">
                            <option class="w-full" v-for="light in lights" :key="light.id" >{{ light.id }}</option>
                        </select>
                    </div>
                </div>
  
                <div class="mt-4 w-full flex justify-between">
                  <AppButton title="Create" class="mr-1" :action="closeModal" />
                  <AppButton title="Close" :action="closeModal" class="bg-red-500 border-red-500 text-white active:bg-red-500 active:border-red-500 active:text-red-500" />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
</template>
