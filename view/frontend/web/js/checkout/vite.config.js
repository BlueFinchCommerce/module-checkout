import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';

const dir = process.argv.includes('--watch') ? './dist-dev' : './dist';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    manifest: true,
    rollupOptions: {
      input: './main.js',
      output: {
        dir,
        entryFileNames: '[name].min.js',
        chunkFileNames: '[name].min.js',
        assetFileNames: '[name].[ext]',
      },
      preserveEntrySignatures: 'allow-extension',
    },
  },
  resolve: {
    alias: {
      '@local': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'js-cookie': fileURLToPath(new URL('./node_modules/js-cookie/dist/js.cookie.js', import.meta.url)),
      mitt: fileURLToPath(new URL('./node_modules/mitt/dist/mitt.js', import.meta.url)),
    },
    dedupe: ['vue'],
  },
});
