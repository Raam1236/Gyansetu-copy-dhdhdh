import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use relative base path to ensure it works on subdomains (GitHub Pages) and root domains (Netlify)
  base: './', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    historyApiFallback: true,
  }
});