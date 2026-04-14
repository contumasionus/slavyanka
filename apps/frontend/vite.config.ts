import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
        prependPath: false,
        configure: (proxy, options) => {
          // Скрываем ошибки прокси пока бэкенд запускается
          proxy.on('error', (err, req, res) => {
            if ((err as any).code === 'ECONNREFUSED') {
              console.log('⌛ Бэкенд еще запускается, запрос', req.url);
              if (!res.headersSent) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Сервер еще запускается, повторите попытку через несколько секунд' }));
              }
            }
          });
        }
      },
    },
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
