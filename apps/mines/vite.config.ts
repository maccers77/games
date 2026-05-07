import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // In production builds the app is deployed under /mines/. In dev we keep
  // the root URL so http://localhost:5173/ continues to work.
  base: command === 'build' ? '/mines/' : '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@games/shell'],
  },
  server: {
    port: 5173,
    host: true,
    fs: {
      allow: ['..', '../..'],
    },
  },
  preview: {
    port: 5173,
    host: true,
  },
}));
