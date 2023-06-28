import { createApp } from 'vue'
import pinia from './stores'

import App from './App.vue'
import router from './router'

// 导入 vant 的样式
import 'vant/lib/index.css'
// 导入全局样式
import './styles/main.scss'
// 导入 svg 的精灵图
import 'virtual:svg-icons-register'
import '@/enums/study'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')

// jfjbwb4477@sandbox.com
