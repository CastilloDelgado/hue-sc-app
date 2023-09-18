<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    interval: {
        typeof: Number,
        default: 100
    }
})

const stringToShow = ref('')
const characters = ["|", "/", "---", "\\"]

var i = 0;
const animation = () => {
    setTimeout(() => {
        stringToShow.value = characters[i]
        if(i === 3){
            i = 0
        } else {
            i++
        }
        if(i < 100000){
            animation()
        }
    }, props.interval)
}

onMounted(() => {
    animation()
})

</script>

<template>
    <p class="w-6 text-center tracking-[-0.20em]">{{ stringToShow }}</p>
</template>