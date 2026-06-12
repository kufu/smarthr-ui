import { fireEvent, render, screen } from '@testing-library/react'

import { IntlProvider } from '../../intl'

import { SearchController } from './SearchController'

import type { UsePDFSearch } from './usePDFSearch'

const renderController = ({
  query = '規則',
  matchCount = 10,
  currentMatchIndex = 0,
}: { query?: string; matchCount?: number; currentMatchIndex?: number } = {}) => {
  const search: UsePDFSearch = {
    query,
    setQuery: vi.fn(),
    matches: [],
    matchCount,
    currentMatchIndex,
    goNext: vi.fn(),
    goPrev: vi.fn(),
    clear: vi.fn(),
    registerPageText: vi.fn(),
  }
  render(
    <IntlProvider locale="ja">
      <SearchController search={search} />
    </IntlProvider>,
  )
  return { search, input: screen.getByRole('textbox') }
}

describe('SearchController', () => {
  describe('IME 変換確定中のキー操作', () => {
    test('変換確定中（isComposing）の Enter ではナビゲーションしない', () => {
      const { input, search } = renderController()
      fireEvent.keyDown(input, { key: 'Enter', isComposing: true })
      expect(search.goNext).not.toHaveBeenCalled()
      expect(search.goPrev).not.toHaveBeenCalled()
    })

    test('変換確定中（isComposing）の Escape では検索をクリアしない', () => {
      const { input, search } = renderController()
      fireEvent.keyDown(input, { key: 'Escape', isComposing: true })
      expect(search.clear).not.toHaveBeenCalled()
    })
  })

  describe('通常のキー操作', () => {
    test('Enter では次の検索結果へ移動する', () => {
      const { input, search } = renderController()
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(search.goNext).toHaveBeenCalledTimes(1)
    })

    test('Shift+Enter では前の検索結果へ移動する', () => {
      const { input, search } = renderController()
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })
      expect(search.goPrev).toHaveBeenCalledTimes(1)
    })

    test('Escape では検索をクリアする', () => {
      const { input, search } = renderController()
      fireEvent.keyDown(input, { key: 'Escape' })
      expect(search.clear).toHaveBeenCalledTimes(1)
    })

    test('query が空の場合は Escape でクリアしない', () => {
      const { input, search } = renderController({ query: '' })
      fireEvent.keyDown(input, { key: 'Escape' })
      expect(search.clear).not.toHaveBeenCalled()
    })
  })
})
