<script setup>
useHead({
  title: 'Iniciar sesión · Hue Show Creator'
})
</script>

<template>
  <div class="login-view">
    <AuthForm />
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.login-view :deep(> div) {
  width: 100%;
}

.login-view :deep(h1) {
  color: #f5f5f5;
  text-align: center;
}

.login-view :deep(h1 + p) {
  text-align: center;
}

.login-view :deep(.text-neutral-600) {
  color: #a3a3a3;
}

.login-view :deep(input) {
  background-color: #171717;
  color: #f5f5f5;
}

.login-view :deep(a) {
  color: #60a5fa;
}

.login-view :deep([role='alert']) {
  color: #f87171;
}

.login-view :deep(button[type='submit']) {
  background-image: linear-gradient(90deg, #22c55e, #3b82f6, #a855f7, #ef4444);
  background-size: 100% 100%;
  background-position: 0% 50%;
  text-shadow: 0 1px 3px rgb(0 0 0 / 45%);
  transition: transform 150ms ease, box-shadow 200ms ease, background-position 350ms ease;
}

.login-view :deep(button[type='submit']:hover:not(:disabled)) {
  background-position: 100% 50%;
  box-shadow: 0 0 24px rgb(168 85 247 / 30%);
}

.login-view :deep(button[type='submit']:active:not(:disabled)) {
  transform: scale(0.97);
}

.login-view :deep(form[aria-busy='true'] button[type='submit']) {
  background-size: 200% 100%;
  animation: login-gradient 1.2s ease-in-out infinite alternate;
}

@keyframes login-gradient {
  from { background-position: 0% 50%; }
  to { background-position: 100% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .login-view :deep(button[type='submit']) {
    transition: none;
    animation: none !important;
    transform: none !important;
  }
}
</style>
