import { act, renderHook } from '@testing-library/react'

import { computeMatchesForPage, escapeRegExp, normalize, usePDFSearch } from './usePDFSearch'

const buildEscapedQuery = (q: string) => escapeRegExp(normalize(q))

const run = (textItems: string[], query: string, startGlobalIndex = 0, pageIndex = 0) =>
  computeMatchesForPage(
    pageIndex,
    textItems.map(normalize),
    buildEscapedQuery(query),
    startGlobalIndex,
  )

describe('computeMatchesForPage', () => {
  test('textItem が空配列の場合は何もマッチしない', () => {
    expect(run([], 'foo')).toEqual({ matches: [], nextGlobalIndex: 0 })
  })

  test('全 textItem が空文字列の場合は何もマッチしない', () => {
    expect(run([''], 'foo')).toEqual({ matches: [], nextGlobalIndex: 0 })
  })

  test('単一 textItem 内のヒットを 1 件として返す', () => {
    expect(run(['abcdef'], 'cd')).toEqual({
      matches: [{ pageIndex: 0, itemIndex: 0, matchStart: 2, matchLength: 2, globalIndex: 0 }],
      nextGlobalIndex: 1,
    })
  })

  test('2 つの textItem を跨ぐヒットは 2 fragments として同じ globalIndex を共有する', () => {
    expect(run(['人事', '制度'], '事制')).toEqual({
      matches: [
        { pageIndex: 0, itemIndex: 0, matchStart: 1, matchLength: 1, globalIndex: 0 },
        { pageIndex: 0, itemIndex: 1, matchStart: 0, matchLength: 1, globalIndex: 0 },
      ],
      nextGlobalIndex: 1,
    })
  })

  test('3 つ以上の textItem を跨ぐヒットも 1 件として扱う', () => {
    expect(run(['ab', 'cd', 'ef'], 'bcde')).toEqual({
      matches: [
        { pageIndex: 0, itemIndex: 0, matchStart: 1, matchLength: 1, globalIndex: 0 },
        { pageIndex: 0, itemIndex: 1, matchStart: 0, matchLength: 2, globalIndex: 0 },
        { pageIndex: 0, itemIndex: 2, matchStart: 0, matchLength: 1, globalIndex: 0 },
      ],
      nextGlobalIndex: 1,
    })
  })

  test('途中に空 textItem を挟むヒットでも空 fragment を生成しない', () => {
    expect(run(['ab', '', 'cd'], 'abcd')).toEqual({
      matches: [
        { pageIndex: 0, itemIndex: 0, matchStart: 0, matchLength: 2, globalIndex: 0 },
        { pageIndex: 0, itemIndex: 2, matchStart: 0, matchLength: 2, globalIndex: 0 },
      ],
      nextGlobalIndex: 1,
    })
  })

  test('先頭に空 textItem が並ぶケースでも itemIndex が正しく解決される', () => {
    expect(run(['', '', 'foo'], 'foo')).toEqual({
      matches: [{ pageIndex: 0, itemIndex: 2, matchStart: 0, matchLength: 3, globalIndex: 0 }],
      nextGlobalIndex: 1,
    })
  })

  test('同一 textItem 内に複数ヒットがある場合は globalIndex が連番になる', () => {
    expect(run(['abcabc'], 'abc')).toEqual({
      matches: [
        { pageIndex: 0, itemIndex: 0, matchStart: 0, matchLength: 3, globalIndex: 0 },
        { pageIndex: 0, itemIndex: 0, matchStart: 3, matchLength: 3, globalIndex: 1 },
      ],
      nextGlobalIndex: 2,
    })
  })

  test('検索は case insensitive である', () => {
    const result = run(['Hello'], 'hello')
    expect(result.matches).toHaveLength(1)
    expect(result.matches[0]).toEqual({
      pageIndex: 0,
      itemIndex: 0,
      matchStart: 0,
      matchLength: 5,
      globalIndex: 0,
    })
  })

  test('NFKC 正規化により全角文字と半角文字が同一視される', () => {
    const result = run(['ＡＢＣ'], 'AB')
    expect(result.matches).toHaveLength(1)
    expect(result.matches[0]).toEqual({
      pageIndex: 0,
      itemIndex: 0,
      matchStart: 0,
      matchLength: 2,
      globalIndex: 0,
    })
  })

  test('startGlobalIndex はページ境界をまたぐ globalIndex の起点として尊重される', () => {
    expect(run(['abc'], 'a', 7)).toEqual({
      matches: [{ pageIndex: 0, itemIndex: 0, matchStart: 0, matchLength: 1, globalIndex: 7 }],
      nextGlobalIndex: 8,
    })
  })

  test('pageIndex は引数として渡された値が fragment にそのまま反映される', () => {
    const result = run(['abc'], 'b', 0, 5)
    expect(result.matches[0].pageIndex).toBe(5)
  })

  test('マッチが見つからない場合は空配列と引数の startGlobalIndex を返す', () => {
    expect(run(['abcdef'], 'xyz', 3)).toEqual({ matches: [], nextGlobalIndex: 3 })
  })
})

describe('usePDFSearch', () => {
  // ページのテキストを登録した状態のフックを用意する。
  const setup = (texts: string[]) => {
    const view = renderHook(() => usePDFSearch('file-url'))
    act(() => {
      view.result.current.registerPageText(0, texts)
    })
    return view
  }

  test('入力時はハイライトのみ表示し、未選択(-1)のままにする（スクロールしない）', () => {
    const { result } = setup(['abc abc abc'])
    act(() => {
      result.current.setQuery('abc')
    })
    expect(result.current.matchCount).toBe(3)
    expect(result.current.matches.length).toBeGreaterThan(0)
    expect(result.current.currentMatchIndex).toBe(-1)
  })

  test('未選択から goNext で先頭ヒット(0)へ移動する', () => {
    const { result } = setup(['abc abc abc'])
    act(() => {
      result.current.setQuery('abc')
    })
    act(() => {
      result.current.goNext()
    })
    expect(result.current.currentMatchIndex).toBe(0)
  })

  test('未選択から goPrev で末尾ヒットへ移動する', () => {
    const { result } = setup(['abc abc abc'])
    act(() => {
      result.current.setQuery('abc')
    })
    act(() => {
      result.current.goPrev()
    })
    expect(result.current.currentMatchIndex).toBe(2)
  })

  test('goNext は末尾の次で先頭へループする', () => {
    const { result } = setup(['abc abc'])
    act(() => {
      result.current.setQuery('abc')
    })
    act(() => {
      result.current.goNext()
    })
    act(() => {
      result.current.goNext()
    })
    act(() => {
      result.current.goNext()
    })
    expect(result.current.currentMatchIndex).toBe(0)
  })

  test('検索語を変更すると選択がリセットされ、次の Enter で再び先頭から始まる', () => {
    const { result } = setup(['abc abc xyz'])
    act(() => {
      result.current.setQuery('abc')
    })
    act(() => {
      result.current.goNext()
    })
    act(() => {
      result.current.goNext()
    })
    expect(result.current.currentMatchIndex).toBe(1)

    act(() => {
      result.current.setQuery('xyz')
    })
    expect(result.current.currentMatchIndex).toBe(-1)
  })

  test('clear で query・matches・選択がすべてリセットされる', () => {
    const { result } = setup(['abc'])
    act(() => {
      result.current.setQuery('abc')
    })
    act(() => {
      result.current.goNext()
    })
    act(() => {
      result.current.clear()
    })
    expect(result.current.query).toBe('')
    expect(result.current.matches).toEqual([])
    expect(result.current.matchCount).toBe(0)
    expect(result.current.currentMatchIndex).toBe(-1)
  })
})
