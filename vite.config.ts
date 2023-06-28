import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
// VantResolver: vant 的解析器，可以解析 .vue 中的模块内容中的 vant 组件
// ElementPlusResolver: element 的解析器
// AntDesignVueResolver: AntDesign 的解析器
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    port: 80,
    host: true,
    open: true
  },
  plugins: [
    vue(),
    Components({
      // dts: 是否给组件自动生成类型声明文件
      dts: false,
      resolvers: [
        // importStyle: 不需要按需导入组件的样式
        VantResolver({ importStyle: false })
      ]
    }),
    createSvgIconsPlugin({
      // 指定图标文件夹，绝对路径（NODE代码）
      iconDirs: [path.resolve(process.cwd(), 'src/icons')]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
