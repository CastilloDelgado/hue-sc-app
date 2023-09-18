<script setup>
defineProps({
    light: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="border-2 border-black mr-2 px-2 py-1">
        <div class="flex">
            <b>ID: </b> <p>{{ light.id }}</p>
        </div>
        <div class="flex">
            <b>Name: </b> <p>{{ light.name }}</p>
        </div>
    </div>
</template>