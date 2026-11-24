import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: './',
  plugins: [react()],
  // SINGLE=1 (build:single) folds the lazily-loaded screens back into one script so the file is self-contained
  build: { target: 'es2022', chunkSizeWarningLimit: 1500, rollupOptions: process.env.SINGLE ? { output: { inlineDynamicImports: true } } : {} },
  server: { port: 5173 },
});
