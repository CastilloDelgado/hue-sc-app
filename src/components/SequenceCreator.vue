<script setup>
import { ref } from 'vue';
import AppInput from './AppInput.vue';
import LightStep from './LightStep.vue';
import AppButton from './AppButton.vue';
import { useBridgeStore } from '../stores/BridgeStore';
import { storeToRefs } from 'pinia';

const bridgeStore = useBridgeStore()
const { lights } = storeToRefs(bridgeStore)

const name = ref('')
const steps = ref([1,2,3,4,5,6,7])

const addStep = () => steps.value.push('')

</script>

<template>
    <div class="mt-2">
        <p class="text-2xl font-bold text-neutral-800">Sequences</p>
        <div class="flex mb-4">
            <AppButton title="Create Sequence"/>
        </div>
        <!-- Sequence -->
        <div>
            <div class="mb-3">
                <p class="text-xl font-bold text-neutral-500">Settings</p>
                <form class="flex mb-2">
                    <AppInput v-model="name" title="Name"/>
                    <AppInput v-model="name" title="BPM"/>
                </form>
                <div>
                    <p>Actions</p>
                    <div class="flex">
                        <AppButton title="Add Step" :action="addStep"/>
                    </div>
                </div>
            </div>
            <div>
                <p class="text-xl font-bold text-neutral-500 mb-2">Steps</p>
                <div class="flex overflow-auto">
                    <div v-for="(step, stepIndex) in steps" :key="step" class="flex flex-row">
                        <div v-if="stepIndex === 0">
                            <p class="h-3 mb-1 mr-1"></p>
                            <p class="h-6 mb-1 mr-1 text-right font-bold" v-for="light in lights" :key="light.id">{{ light.id  }}</p>
                        </div>
                        <div class="flex flex-col">
                            <p class="text-xs text-right pr-1">{{ stepIndex + 1 }}</p>
                            <LightStep v-for="lightStep in lights" :key="lightStep" class="">
                                
                            </LightStep>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>