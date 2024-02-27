import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    manifest: true,
    rollupOptions: {
      input: './main.js',
      output: {
        entryFileNames: '[name].min.js',
        chunkFileNames: '[name].min.js',
        assetFileNames: '[name].[ext]',
        manualChunks: {
          adyen: ['@adyen/adyen-web'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@/services/getNominatedShippingMethods': fileURLToPath(new URL('./services/getNominatedShippingMethods', import.meta.url)),
      '@local': fileURLToPath(new URL("./", import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['vue']
  },
});
