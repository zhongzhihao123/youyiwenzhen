import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
// 使用插件
pinia.use(persist)
export default pinia

// 统一导出 store
export * from './user'
export * from './consult'
