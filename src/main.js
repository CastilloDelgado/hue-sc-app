import "./assets/style.css"

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useBridgeStore } from './stores/BridgeStore'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const bridgeStore = useBridgeStore()

app.mount('#app')
