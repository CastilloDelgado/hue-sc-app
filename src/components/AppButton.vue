<script setup>
defineProps({
    title: {
        type: String,
        default: ""
    },
    disabled:{
        type: Boolean,
        default: false
    },
    action: {
        type: Function,
        default: () => console.log('Action fucntion not set')
    }
})
</script>

<template>
    <div class="bg-black text-white hover:bg-white h-fit border-black border-2 hover:text-black px-2 disabled:bg-gray-500 disabled:text-white disabled:border-gray-500 active:bg-green-500 active:border-green-500 active:text-white" :disabled="disabled" type="button" @click="action">
        <slot />
        <p v-if="title">{{ title }}</p>
    </div>
</template>