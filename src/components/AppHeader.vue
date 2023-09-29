<script setup>
import { version } from "../../package.json"
</script>

<template>
    <div class="w-full pt-3">
        <div class="flex justify-center mb-3">
            <p class="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-blue-500 via-purple-500 to-red-500 w-fit underline">Hue Show Creator</p>
            <p class="text-xs flex items-end text-neutral-500 pb-[2px]">Version {{ version }}</p>
        </div>
        <div class="bg-gradient-to-r from-green-500 via-blue-500 via-purple-500 to-red-500 py-1">
        </div>
    </div>
</template>