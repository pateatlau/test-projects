import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/node': {
        target: 'http://127.0.0.1:3000',
        rewrite: (path) => path.replace(/^\/api\/node/, ''),
      },
      '/api/python': {
        target: 'http://127.0.0.1:8001',
        rewrite: (path) => path.replace(/^\/api\/python/, ''),
      },
    },
  },
});
