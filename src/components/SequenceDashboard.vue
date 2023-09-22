<script setup>
import LightStep from './LightStep.vue';
import { useSequenceStore } from '../stores/SequenceStore'
import AppButton from './AppButton.vue';
import AppLoader from './AppLoader.vue';
import LightStateForm from "./LightStateForm.vue"
import { ref } from 'vue';
import { setLightState } from "../composables/HueServices"

const sequenceStore = useSequenceStore()

const props = defineProps({
    sequence: {
        type: Object,
        required: true
    },
    sequenceIndex: {
        type: Number,
        required: true
    }
})

const isLightStateModalOpen = ref(false)
const closeLightStateModal = () => isLightStateModalOpen.value = false
const openLightStateModal = (sequenceIndex, stepIndex, lightIndex) => {
    sequenceStore.selectStep(sequenceIndex, stepIndex, lightIndex)
    isLightStateModalOpen.value = true
}

const playing = ref(false)
const activeStep = ref(0)

const steps = ref(sequenceStore.sequences[props.sequenceIndex].steps)
const lights = ref(sequenceStore.sequences[props.sequenceIndex].lights)

const loop = () => {
    setTimeout(() => {
        // Update lights state
        steps.value[activeStep.value].forEach((lightState, lightIndex) => {
            setLightState(lights.value[lightIndex], lightState)
        })

        activeStep.value = activeStep.value + 1
        if(activeStep.value === steps.value.length){
            activeStep.value = 0
        }
        if(activeStep.value < steps.value.length && playing.value){
            loop()
        }
    }, props.sequence.bpm)
}

const togglePlaying = () => {
    playing.value = !playing.value
    if(playing.value === true){
        activeStep.value = 0
        loop()
    }
}
</script>

<template>
    <div class="mb-4">
        <div class="mb-3">
            <div class="flex mb-2 items-end">
                <b class="mr-2 text-3xl font-bold text-blue-600">{{ sequence.name }}</b>
                <b>BPM: </b>
                <p>{{ sequence.bpm }}</p>
            </div>
            <p class="text-xl font-bold text-neutral-500">Settings</p>
            <div>
                <p>Actions</p>
                <div class="flex">
                    <AppButton class="mr-1" title="Add Step" :action="() => sequenceStore.addStepToSequence(sequence.id)"/>
                    <AppButton 
                        :title="!playing ? 'Play' : 'Stop'" 
                        class="text-white hover:border-black"
                        :class="`${!playing ? 'bg-blue-600 border-blue-600 active:bg-blue-500 active:border-blue-500' : 'bg-red-600 border-red-600 active:bg-red-500 active:border-red-500'}`"
                        :action="togglePlaying"
                    />
                    <AppLoader v-if="playing" />
                </div>
            </div>
        </div>
        <div>
            <p class="text-xl font-bold text-neutral-500 mb-2">Steps</p>
            <div class="flex overflow-auto">
                <div v-for="(step, stepIndex) in sequence.steps" :key="step" class="flex flex-row">
                    <div v-if="stepIndex === 0">
                        <p class="h-3 mb-1 mr-1"></p>
                        <p class="h-6 mb-1 mr-1 text-right font-bold" v-for="light in sequence.lights" :key="light">{{ light }}</p>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-xs text-center hover:bg-black hover:text-white mr-1" :class="`${activeStep === stepIndex && playing ? 'bg-green-600 text-white' : ''}`">{{ stepIndex + 1 }}</p>
                        <LightStep v-for="(lightStep, lightIndex) in step" :key="lightStep" class="" @click="openLightStateModal(sequenceIndex, stepIndex, lightIndex)" :class="`${lightStep !== '' ? 'bg-black hover:bg-white' : ''}`" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <LightStateForm :is-open="isLightStateModalOpen" :open-modal="openLightStateModal" :close-modal="closeLightStateModal" />
</template>