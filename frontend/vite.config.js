// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api will be proxied
      '/api': {
        target: 'http://localhost:5500', // Your backend server URL from server.js
        changeOrigin: true, // Recommended for most cases
        // secure: false, // Uncomment if your backend is HTTPS with self-signed cert (dev only)
        // No rewrite needed here as your backend routes are already prefixed with /api
      },
    },
  },
});
