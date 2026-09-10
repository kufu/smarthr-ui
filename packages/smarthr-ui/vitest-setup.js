import '@testing-library/jest-dom/vitest'

// ResizeObserver のモック
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
