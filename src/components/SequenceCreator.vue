<script setup>
import { ref } from 'vue';
import AppInput from './AppInput.vue';
import LightStep from './LightStep.vue';

const name = ref('')
const steps = ref([1,2,3,4,5])

</script>

<template>
    <div class="mt-2">
        <p class="text-2xl font-bold text-neutral-800 mb-4">Sequences</p>
        <!-- Sequence -->
        <div>
            <div class="mb-3">
                <p class="text-xl font-bold text-neutral-500">Settings</p>
                <form class="flex">
                    <AppInput v-model="name" title="Name"/>
                    <AppInput v-model="name" title="BPM"/>
                </form>
            </div>
            <div>
                <p class="text-xl font-bold text-neutral-500">Steps</p>
                <div v-for="step in steps" :key="step" class="flex">
                    <LightStep v-for="lightStep in [1,2,3,4,5]" :key="lightStep" class="bg-black">

                    </LightStep>
                </div>
            </div>
        </div>
    </div>
</template>