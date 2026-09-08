import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // Listen on all network interfaces (0.0.0.0), not just localhost,
    // so devices on the same Wi-Fi (like a phone) can reach the dev server.
    host: true,
  },
})
