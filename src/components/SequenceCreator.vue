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
const closeCreateFormModal = () => isCreateFormModalOpen.value = false
const openCreateFormModal = () => isCreateFormModalOpen.value = true
const saveSequencesLocally = () => localStorage.setItem('savedSequences', JSON.stringify(sequences.value))

</script>

<template>
    <div class="mt-2">
        <div class="flex items-end mb-4">
            <p class="text-2xl font-bold text-neutral-800 mr-2">Sequences</p>
            <AppButton class="mr-1" title="Create Sequence" :action="openCreateFormModal"/>
            <AppButton title="Save Sequences Locally" :action="saveSequencesLocally"/>
        </div>
        <div class="pl-4 border-l-2 border-black">
            <SequenceDashboard v-for="(sequence, sequenceIndex) in sequences" :key="sequence.key" :sequence="sequence" :sequence-index="sequenceIndex"/>
        </div>
        <CreateSequenceForm :is-open="isCreateFormModalOpen" :open-modal="openCreateFormModal" :close-modal="closeCreateFormModal" />
    </div>
</template>