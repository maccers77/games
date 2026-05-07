import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // In production builds the app is deployed under /crash/. In dev we keep
  // the root URL so http://localhost:5174/ continues to work.
  base: command === 'build' ? '/crash/' : '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@games/shell'],
  },
  server: {
    port: 5174,
    host: true,
    fs: {
      allow: ['..', '../..'],
    },
  },
  preview: {
    port: 5174,
    host: true,
  },
}));
