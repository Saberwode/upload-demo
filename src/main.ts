/*
 * @Description: 
 * @Author: jmguo2
 * @Date: 2023-03-13 09:53:15
 * @LastEditors: jmguo2
 * @LastEditTime: 2023-03-13 11:55:14
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router'
import './styles/reset.scss'

// import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
