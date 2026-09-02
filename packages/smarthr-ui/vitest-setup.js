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

if (!('ariaNotify' in Document.prototype)) {
  Document.prototype.ariaNotify = function ariaNotify() {}
}
