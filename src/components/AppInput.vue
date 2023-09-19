<script setup>
import AppLoader from './AppLoader.vue';

defineProps(['modelValue', 'loading', 'title'])
defineEmits(['update:modelValue'])
</script>

<template>
    <div class="flex mb-1">
        <b class="mr-2">{{ title }}:</b>
        <input
            class="border-[1px] border-neutral-800 px-1"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
        <AppLoader v-if="loading" />
    </div>
</template>