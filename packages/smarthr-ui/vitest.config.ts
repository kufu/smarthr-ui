import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./src/**/*.test.ts(x)?', './src/**/__tests__/*.ts(x)?'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest-setup.js'],
  },
})
