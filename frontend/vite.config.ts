import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  optimizeDeps: {
    exclude: [
      "chunk-64HT3LH6.js",
      "chunk-5WN4RLNU.js"
    ]
  },
  build: {
    // Optional: Prevent Vite from stopping on warnings or TypeScript errors
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore TS warnings
        if (warning.code === 'TS') return;
        warn(warning);
      },
    },
  },
});
