import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import http from 'https'

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd());


  return {
    base: '/',
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_DOMAIN_SERVER,
          secure: false,
          // changeOrigin: true,
          // agent: new http.Agent()
        },
      }
    }
  }
})
