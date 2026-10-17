<script setup>
useHead({ title: 'Perfil · Hue Show Creator' })
const { user, fetch: refreshSession } = useUserSession()
const email = ref(user.value?.email || '')
const password = ref('')
const pending = ref(false)
const error = ref('')
const success = ref('')

async function save() {
  if (pending.value) return
  pending.value = true
  error.value = ''
  success.value = ''
  try {
    await $fetch('/api/auth/profile', { method: 'PATCH', body: { email: email.value, password: password.value } })
    await refreshSession()
    email.value = user.value.email
    success.value = 'Tu información se actualizó correctamente.'
  } catch (failure) {
    error.value = failure.data?.message || 'No pudimos guardar los cambios. Intenta de nuevo.'
  } finally {
    password.value = ''
    pending.value = false
  }
}
</script>

<template>
  <section class="dashboard-section">
    <h1 class="text-3xl font-bold text-blue-400 mb-3">Perfil</h1>
    <p class="text-neutral-300 mb-8">Actualiza el correo de tu cuenta. Confirma tu contraseña actual para guardar el cambio.</p>
    <form class="max-w-md space-y-6" :aria-busy="pending" @submit.prevent="save">
      <div>
        <label for="profile-email" class="block mb-2 font-semibold">Correo electrónico</label>
        <input id="profile-email" v-model="email" class="w-full border px-3 py-3" type="email" autocomplete="email" required maxlength="254" :disabled="pending" />
      </div>
      <div>
        <label for="profile-password" class="block mb-2 font-semibold">Contraseña actual</label>
        <input id="profile-password" v-model="password" class="w-full border px-3 py-3" type="password" autocomplete="current-password" required maxlength="128" :disabled="pending" />
      </div>
      <p v-if="error" role="alert" class="text-red-400 text-sm">{{ error }}</p>
      <p v-if="success" role="status" class="text-green-400 text-sm">{{ success }}</p>
      <button class="hue-action" type="submit" :disabled="pending">{{ pending ? 'Guardando…' : 'Guardar cambios' }}</button>
    </form>
  </section>
</template>
