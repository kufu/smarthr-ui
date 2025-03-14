import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: { allowedHosts: true, proxy: {} },
  plugins: [reactRouter(), react()],
})
