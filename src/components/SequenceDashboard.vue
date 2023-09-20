<script setup>
import LightStep from './LightStep.vue';
import { useSequenceStore } from '../stores/SequenceStore'
import AppButton from './AppButton.vue';
import AppLoader from './AppLoader.vue';
import { ref } from 'vue';

const sequenceStore = useSequenceStore()

defineProps({
    sequence: {
        type: Object,
        required: true
    }
})

const playing = ref(false)

const togglePlaying = () => playing.value = !playing.value

</script>

<template>
    <div>
        <div class="mb-3">
            <p class="text-xl font-bold text-neutral-500">Settings</p>
            <form class="flex mb-2">
                <b class="mr-2">{{ sequence.name }}</b>
                <p>BPM: {{ sequence.bpm }}</p>
            </form>
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
                        <p class="h-6 mb-1 mr-1 text-right font-bold" v-for="light in sequence.lights" :key="light">{{ light  }}</p>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-xs text-right pr-1">{{ stepIndex + 1 }}</p>
                        <LightStep v-for="lightStep in step" :key="lightStep" class="">
                            
                        </LightStep>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>