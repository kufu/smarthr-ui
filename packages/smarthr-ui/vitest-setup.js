import '@testing-library/jest-dom/vitest'

import { createElement } from 'react'
import { vi } from 'vitest'

import { EnvironmentProvider } from './src/hooks/client/useEnvironment'

// HINT: useEnvironment()はEnvironmentProviderの外では例外を投げる設計。
// 実プロダクトではapp root相当でEnvironmentProviderを必ず設置する前提のため、
// テストでも同様にrender()の結果を常にEnvironmentProviderで包む。
// render()が返すrerender()はoptions.wrapperを経由して再適用されるため、
// uiを直接ラップするのではなくoptions.wrapperとして渡す
vi.mock('@testing-library/react', async (importOriginal) => {
  const mod = await importOriginal()

  const wrapWithEnvironment = (OuterWrapper) =>
    function EnvironmentTestWrapper({ children }) {
      const wrapped = createElement(EnvironmentProvider, null, children)
      return OuterWrapper ? createElement(OuterWrapper, null, wrapped) : wrapped
    }

  return {
    ...mod,
    render: (ui, options) =>
      mod.render(ui, { ...options, wrapper: wrapWithEnvironment(options?.wrapper) }),
  }
})

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
