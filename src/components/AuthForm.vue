<script setup>
import { computed, ref } from 'vue'

const props = defineProps({ registration: { type: Boolean, default: false } })
const email = ref('')
const password = ref('')
const confirmation = ref('')
const pending = ref(false)
const error = ref('')
const title = computed(() => props.registration ? 'Crear cuenta' : 'Iniciar sesión')
const { fetch: refreshSession } = useUserSession()

async function submit() {
  if (pending.value) return
  error.value = ''
  if (props.registration && password.value !== confirmation.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  pending.value = true
  try {
    await $fetch(`/api/auth/${props.registration ? 'register' : 'login'}`, {
      method: 'POST', body: { email: email.value, password: password.value }
    })
    password.value = ''
    confirmation.value = ''
    await refreshSession()
    await navigateTo('/')
  } catch (failure) {
    error.value = failure.data?.message || 'No pudimos conectar. Intenta de nuevo.'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-md px-6 py-12">
    <h1 class="text-3xl font-bold text-neutral-900">{{ title }}</h1>
    <p class="mt-2 text-sm text-neutral-600">Accede a tu espacio para crear secuencias de luces.</p>
    <form class="mt-8 space-y-5" :aria-busy="pending" @submit.prevent="submit">
      <div>
        <label for="email" class="block text-sm font-semibold mb-2">Correo electrónico</label>
        <input id="email" v-model="email" type="email" name="email" autocomplete="email" required maxlength="254" :disabled="pending" class="w-full rounded border border-neutral-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
      </div>
      <div>
        <label for="password" class="block text-sm font-semibold mb-2">Contraseña</label>
        <input id="password" v-model="password" type="password" name="password" :autocomplete="registration ? 'new-password' : 'current-password'" required :minlength="registration ? 12 : 1" maxlength="128" :disabled="pending" :aria-describedby="registration ? 'password-help' : undefined" class="w-full rounded border border-neutral-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
        <p v-if="registration" id="password-help" class="mt-2 text-xs text-neutral-600">Usa entre 12 y 128 caracteres. Puedes usar una frase.</p>
      </div>
      <div v-if="registration">
        <label for="confirmation" class="block text-sm font-semibold mb-2">Confirmar contraseña</label>
        <input id="confirmation" v-model="confirmation" type="password" name="confirmation" autocomplete="new-password" required minlength="12" maxlength="128" :disabled="pending" class="w-full rounded border border-neutral-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
      </div>
      <p v-if="error" role="alert" class="text-sm text-red-700">{{ error }}</p>
      <button type="submit" :disabled="pending" class="w-full rounded bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">{{ pending ? 'Un momento…' : title }}</button>
    </form>
    <p class="mt-6 text-sm text-center text-neutral-600">
      {{ registration ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?' }}
      <NuxtLink :to="registration ? '/login' : '/register'" class="text-blue-700 underline">{{ registration ? 'Iniciar sesión' : 'Crear cuenta' }}</NuxtLink>
    </p>
  </div>
</template>
