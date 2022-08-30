/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react(),
    legacy({
      // > 0.5%, last 2 versions, Firefox ESR, not dead
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  test: {
    environment: 'jsdom',
    exclude: ['node_modules', 'website/**'],
    globals: true,
  },
});
