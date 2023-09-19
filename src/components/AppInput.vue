<script setup>
import AppLoader from './AppLoader.vue';

defineProps({
    title: {
        type: String,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
},['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
    <div class="flex mb-1">
        <b class="mr-2">{{ title }}:</b>
        <input
            class="border-[1px] border-neutral-800"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
        <AppLoader v-if="loading" />
    </div>
</template>