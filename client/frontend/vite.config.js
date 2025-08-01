import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/run': 'https://compilex-ft0f.onrender.com',
    },
  },
});
