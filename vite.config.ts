import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// PORT and BASE_PATH are optional. Defaults work for most static hosts
// (Vercel, Netlify, Cloudflare Pages, Nginx). Set BASE_PATH only if the
// site is served from a sub-path, e.g. BASE_PATH=/panama/
const port = Number(process.env.PORT) || 5173;
const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    // Don't ship source maps (keeps source code out of the public bundle).
    sourcemap: false,
  },
  server: {
    port,
    host: '0.0.0.0',
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
  },
});
