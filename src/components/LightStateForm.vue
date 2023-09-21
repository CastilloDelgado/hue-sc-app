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

const sequenceStore = useSequenceStore()
const { stepSelected } = storeToRefs(sequenceStore)

const state = ref('')

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

const saveState = () => {
    // sequenceStore.updateStepState({
    //     on: on.value,
    //     bri: bri.value,
    //     color: color.value
    // })
}

watch(stepSelected, () => {
  state.value = sequenceStore.getState()
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
                  class="text-xl font-bold leading-6 text-gray-900"
                >
                  Light State
                </DialogTitle>
                <div class="flex mb-6">
                  <!-- <b>Light ID:</b> <p class="mr-4">{{ sequenceStore.getState.light }}</p> -->
                  <!-- <b>Step:</b> <p>{{ stepSelected.stepIndex + 1 }}</p> -->
                </div>
                <div class="mb-6 flex">
                    <!-- <AppInput title="On" v-model="on"/>
                    <AppInput title="Bri" v-model="bri"/>
                    <AppInput title="Color" v-model="color"/> -->
                    <p class="mr-2">Light State:</p>
                    <textarea v-model="state" class="border-[1px] border-black" />
                </div>
  
                <div class="mt-4 w-full flex justify-between">
                  <AppButton title="Save" :action="saveState"/>
                  <AppButton title="Close" :action="closeModal" class="bg-red-500 border-red-500 text-white active:bg-red-500 active:border-red-500 active:text-red-500" />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
</template>
