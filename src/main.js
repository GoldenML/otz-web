import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import router from './router/router.js'
import '@/assets/css/index.scss'
import VueCookies from 'vue-cookies'
import { createPinia } from 'pinia'
import socket from '@/utils/connectSocket.js'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(VueCookies)
app.use(createPinia())
app.use(Viewer, {
  defaultOptions: {
    zIndex: 99999,
    toolbar: false,
    transition: false,
    title: false,
    navbar: false,
    scalable: false,
    rotatable: false,
    tooltip: false,
    inline: false,
  }
})
app.provide('socket', socket)
app.mount('#app')
