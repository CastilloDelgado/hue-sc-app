<script setup>
import { ref } from 'vue';
import AppButton from './AppButton.vue';
import CreateSequenceForm from './CreateSequenceForm.vue';
import SequenceDashboard from './SequenceDashboard.vue';
import { useSequenceStore } from '../stores/SequenceStore';
import { storeToRefs } from 'pinia';

const sequenceStore = useSequenceStore()
const { sequences } = storeToRefs(sequenceStore)

const isCreateFormModalOpen = ref(false)

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
            <SequenceDashboard v-for="sequence in sequences" :key="sequence.key" :sequence="sequence"/>
        </div>
        <CreateSequenceForm :is-open="isCreateFormModalOpen" :open-modal="openModal" :close-modal="closeModal" />
    </div>
</template>