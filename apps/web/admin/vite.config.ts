import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import { mockPlugin } from '../../../mock/plugin'

// mock 模式（默认开启）：无后端时由 mock 插件拦截 API 请求，此时禁用代理，
// 避免前端路由导航被误转发到后端
const useMock = process.env.VITE_USE_MOCK !== 'false'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts'
    }),
    mockPlugin(useMock)
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5174,
    proxy: useMock
      ? {}
      : {
          '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/auth': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/article': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/category': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/comment': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/tag': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/system': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/role': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/menu': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/user': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/file': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/publish': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/recycle': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/analytics': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/column': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/mail': {
            target: 'http://localhost:8080',
            changeOrigin: true
          },
          '/idempotent': {
            target: 'http://localhost:8080',
            changeOrigin: true
          }
        }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@vellastra/ui/styles/variables.scss" as *;`
      }
    }
  }
})
