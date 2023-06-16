import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import router from './router/router.js'
import '@/assets/css/index.scss'
import VueCookies from 'vue-cookies'


const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(VueCookies)
app.mount('#app')
