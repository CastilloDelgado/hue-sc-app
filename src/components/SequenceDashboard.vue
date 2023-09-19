<script setup>

</script>

<template>
    <div>
        <div class="mb-3">
            <p class="text-xl font-bold text-neutral-500">Settings</p>
            <form class="flex mb-2">
                <!-- <AppInput v-model="name" title="Name"/> -->
                <!-- <AppInput v-model="name" title="BPM"/> -->
            </form>
            <div>
                <p>Actions</p>
                <div class="flex">
                    <!-- <AppButton title="Add Step" :action="addStep"/> -->
                </div>
            </div>
        </div>
        <div>
            <p class="text-xl font-bold text-neutral-500 mb-2">Steps</p>
            <div class="flex overflow-auto">
                <div v-for="(step, stepIndex) in []" :key="step" class="flex flex-row">
                    <div v-if="stepIndex === 0">
                        <p class="h-3 mb-1 mr-1"></p>
                        <p class="h-6 mb-1 mr-1 text-right font-bold" v-for="light in lights" :key="light.id">{{ light.id  }}</p>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-xs text-right pr-1">{{ stepIndex + 1 }}</p>
                        <LightStep v-for="lightStep in []" :key="lightStep" class="">
                            
                        </LightStep>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>