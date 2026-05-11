import { computeMatchesForPage } from './usePDFSearch'

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const buildEscapedQuery = (q: string) => escapeRegExp(q.normalize('NFKC'))

const run = (textItems: string[], query: string, startGlobalIndex = 0, pageIndex = 0) =>
  computeMatchesForPage(pageIndex, textItems, buildEscapedQuery(query), startGlobalIndex)

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
