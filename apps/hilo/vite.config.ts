import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // In production builds the app is deployed under /hilo/. In dev we keep
  // the root URL so http://localhost:5175/ continues to work.
  base: command === 'build' ? '/hilo/' : '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@games/shell'],
  },
  server: {
    port: 5175,
    host: true,
    fs: {
      allow: ['..', '../..'],
    },
  },
  preview: {
    port: 5175,
    host: true,
  },
}));
