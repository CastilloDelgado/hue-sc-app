<script setup>
import AppHeader from './AppHeader.vue';

</script>

<template>
    <div class="flex">
        <div class="mx-5">
            <AppHeader></AppHeader>
            <slot />
        </div>
    </div>
</template>