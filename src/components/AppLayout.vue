<script setup>
import AppHeader from './AppHeader.vue';

</script>

<template>
    <div class="flex justify-center bg-black min-h-screen">
        <div class="mx-5 bg-neutral-50 container">
            <AppHeader></AppHeader>
            <slot />
        </div>
    </div>
</template>