import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('motion')) return 'motion';
            if (id.includes('swiper')) return 'swiper';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react-router')) return 'router';
            if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor';
          },
        },
      },
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET ?? 'http://127.0.0.1:3333',
          changeOrigin: true,
        },
        '/sitemap.xml': {
          target: env.VITE_API_PROXY_TARGET ?? 'http://127.0.0.1:3333',
          changeOrigin: true,
        },
        '/robots.txt': {
          target: env.VITE_API_PROXY_TARGET ?? 'http://127.0.0.1:3333',
          changeOrigin: true,
        },
      },
    },
  };
});
