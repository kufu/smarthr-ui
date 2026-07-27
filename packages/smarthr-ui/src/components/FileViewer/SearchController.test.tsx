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
    handleChangeQuery: vi.fn(),
    handleKeyDownQuery: vi.fn(),
    matches: [],
    matchCount,
    currentMatchIndex,
    goNext: vi.fn(),
    goPrev: vi.fn(),
    generateHandlePDFPageGetTextSuccess: vi.fn(),
  }
  render(
    <IntlProvider locale="ja">
      <SearchController search={search} />
    </IntlProvider>,
  )
  return { search, input: screen.getByRole('textbox') }
}

describe('SearchController', () => {
  test('キー入力時に handleKeyDownQuery が呼ばれる', () => {
    const { input, search } = renderController()
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(search.handleKeyDownQuery).toHaveBeenCalledTimes(1)
  })

  test('キーイベントオブジェクトが handleKeyDownQuery に渡される', () => {
    const { input, search } = renderController()
    fireEvent.keyDown(input, { key: 'Escape', shiftKey: true })
    expect(search.handleKeyDownQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'Escape',
        shiftKey: true,
      }),
    )
  })
})
