import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'; // router.tsをインポート

const app = createApp(App)

app.use(router) // Vue Routerを使用する
app.use(createPinia())

app.mount('#app')
