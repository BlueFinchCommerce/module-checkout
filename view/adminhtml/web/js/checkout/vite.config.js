import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    minify: false,
    manifest: true,
    rollupOptions: {
      input: './main.js',
      output: {
        entryFileNames: '[name].min.js',
        chunkFileNames: '[name].min.js',
        assetFileNames: '[name].[ext]',
      },
      preserveEntrySignatures: 'allow-extension',
    },
  },
  esbuild: {
    format: 'iife',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['vue'],
  },
  define: {
    __INTLIFY_JIT_COMPILATION__: true,
  },
});
