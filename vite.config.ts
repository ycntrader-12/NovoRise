import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'admin-redirect-middleware',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const host = req.headers.host || '';
          // Si la requête arrive sur le port 3007 (Admin Portal) et vise la racine /
          if (host.includes('3007') && (req.url === '/' || req.url === '/index.html')) {
            req.url = '/admin.html';
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 3005,
    open: false,
    proxy: {
      // Redirige toutes les requêtes /api vers le backend Express (port 3006)
      '/api': {
        target: 'http://localhost:3006',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        admin: 'admin.html',
      },
    },
  },
});
