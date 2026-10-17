<script setup>
import AppHeader from './AppHeader.vue';

const route = useRoute()
const isLogin = computed(() => route.path === '/login')
const isDashboard = computed(() => !['/login', '/register'].includes(route.path))
useHead({
    link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap' }
    ]
})
</script>

<template>
    <DashboardShell v-if="isDashboard"><slot /></DashboardShell>
    <div v-else class="flex justify-center bg-black min-h-screen">
        <div class="mx-5 container" :class="isLogin ? 'login-layout flex flex-col bg-black text-neutral-100' : route.path === '/' ? 'main-theme bg-black text-neutral-100' : 'bg-neutral-50'">
            <AppHeader></AppHeader>
            <slot />
        </div>
    </div>
</template>

<style scoped>
.login-layout {
    font-family: 'Space Grotesk', sans-serif;
}
</style>
