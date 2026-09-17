import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        dashboard:    resolve(__dirname, 'src/main.ts'),
        transactions: resolve(__dirname, 'src/transactions.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
    outDir: 'dist',
  },
});
