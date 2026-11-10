// jsdomにResizeObserverがないためモックする
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// act() を使うテストで React の警告が出ないようにする
globalThis.IS_REACT_ACT_ENVIRONMENT = true
