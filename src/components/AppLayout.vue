<script setup>
import AppHeader from './AppHeader.vue';

</script>

<template>
    <div class="flex justify-center bg-neutral-400 min-h-screen">
        <div class="mx-5 bg-neutral-50">
            <AppHeader></AppHeader>
            <slot />
        </div>
    </div>
</template>