import { createApp } from 'vue'
import  './assets/reset.css'
import App from './App.vue'
import 'uno.css'
import '@unocss/reset/tailwind.css'
import {createPinia} from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import { router } from './router'
const pinia = createPinia()
pinia.use(piniaPersist)
const app = createApp(App)
app.use(router)
app.use(pinia)
window.pinia = pinia
app.mount('#app')