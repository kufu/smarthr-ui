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

// react-pdf(pdfjs-dist)がモジュールロード時に参照するため必要なモック
global.DOMMatrix = class DOMMatrix {}
