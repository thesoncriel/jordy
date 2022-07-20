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
    // TODO: react-router 업데이트 후 테스트코드 다시 작성하여 아래 목록에서 제외 할 것 - theson
    exclude: ['node_modules', 'packages/route-system'],
    globals: true,
  },
});
