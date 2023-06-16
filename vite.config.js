import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server:{
    port: 3001,
    https: false,
    proxy: {
      '^/otz': {
        target: 'http://43.154.31.254:13000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      scss: {
        // 引入 mixin.scss 这样就可以在全局中使用 mixin.scss中预定义的变量了
        // 给导入的路径最后加上 ;
        additionalData: '@import "@/assets/css/mixin.scss";'
      }
    }
  }
})
