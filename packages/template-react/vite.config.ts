import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  base: './',
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [
    react(),
    glsl(),
    {
      name: 'full-reload',
      handleHotUpdate({ server }) {
        server.ws.send({ type: 'full-reload' });
        return [];
      },
    },
  ],
});
