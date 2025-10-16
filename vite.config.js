import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  // =========================================================
  // CORREÇÃO: ADICIONAR optimizeDeps
  // =========================================================
  optimizeDeps: {
    // Exclui 'stompjs' da otimização inicial do Vite. 
    // Isso força o uso do SockJS, resolvendo o erro "Could not resolve 'websocket'".
    exclude: ['stompjs'],
  },
  // =========================================================
})

