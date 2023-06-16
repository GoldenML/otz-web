import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  // build: {
  //   assetsDir: './static',
  //   chunkSizeWarningLimit: 500,
  //   minify: 'terser',
  //   cssCodeSplit: true, // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
  //   terserOptions: {
  //     compress: {
  //       // warnings: false,
  //       drop_console: true,  //打包时删除console
  //       drop_debugger: true, //打包时删除 debugger
  //       pure_funcs: ['console.log'],
  //     },
  //     output: {
  //       // 去掉注释内容
  //       comments: true,
  //     },
  //   },
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         // 拆分代码，这个就是分包，配置完后自动按需加载，现在还比不上webpack的splitchunk，不过也能用了。
  //         vue: ['vue', 'vue-router', 'vuex'],
  //         // echarts: ['echarts'],
  //       },
  //     },
  //   },
  //   brotliSize: false,
  // },

  plugins: [vue(), viteCompression(),],
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
  },
})
