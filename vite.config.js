import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // vue-i18n feature flags: Composition API only, so the legacy API can be
  // tree-shaken. Also silences the esm-bundler warning in the console.
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  server: {
    // Listen on all network interfaces (0.0.0.0), not just localhost,
    // so devices on the same Wi-Fi (like a phone) can reach the dev server.
    host: true,
    // Auth API (server/index.js). Proxying keeps the session cookie
    // same-origin, so no CORS setup is needed.
    proxy: {
      '/api': 'http://127.0.0.1:3001',
    },
  },
})
