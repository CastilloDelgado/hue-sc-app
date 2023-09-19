<script setup>
import { ref } from 'vue';
import AppButton from './AppButton.vue';
import CreateSequenceForm from './CreateSequenceForm.vue';

const isCreateFormModalOpen = ref(true)

function closeModal() {
    isCreateFormModalOpen.value = false
}
function openModal() {
    isCreateFormModalOpen.value = true
}

</script>

<template>
    <div class="mt-2">
        <div class="flex items-end mb-4">
            <p class="text-2xl font-bold text-neutral-800 mr-2">Sequences</p>
            <AppButton title="Create Sequence" :action="openModal"/>
        </div>
        <div class="pl-4 border-l-2 border-black">
            <CreateSequenceForm :is-open="isCreateFormModalOpen" :open-modal="openModal" :close-modal="closeModal" />
        </div>
    </div>
</template>