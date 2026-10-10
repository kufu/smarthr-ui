import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      // package.jsonのimportsはlibの成果物を指すため、ビルド前のsrcだけでは解決できない。
      // jsdom環境ではbrowser条件と同じ入口を使う。配布物の検証はaliasなしで別途行う。
      '#html': fileURLToPath(new URL('./src/adapters/html.browser.ts', import.meta.url)),
    },
  },
  test: {
    include: ['./src/**/*.test.ts(x)?', './src/**/__tests__/*.ts(x)?'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest-setup.js'],
  },
})
