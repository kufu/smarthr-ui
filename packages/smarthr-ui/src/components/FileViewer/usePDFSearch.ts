import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { PDFSearchMatch } from './types'

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// ユーザーの入力した文字と PDF 上の文字を同一視して検索できるよう NFKC で正規化する。
const normalize = (s: string) => s.normalize('NFKC')

/**
 * pdf.js から渡される textItems から検索文字でマッチしたものを抽出し、textItem 単位の fragment に分解して返す。
 *
 * pdf.js が抽出する textItems は、視覚的に連続して見える文字列でも PDF の内部構造によって複数の要素に分割される。
 * 例えば "人事評価について" が ["人事", "評価", "に", "ついて"] のように分かれていることがある。
 * このため textItem ごとに個別検索すると "人事事評価" や "について" のような跨いだマッチを検出できない。
 *
 * そのため、すべての textItem を連結した joinedPageText 上で検索することで跨いだマッチも検出し、
 * 見つかったマッチを描画時に必要な「textItem 単位の fragment」に分解し直している。
 *
 * 1 件のマッチが複数 textItem に跨る場合は複数 fragment を返すが、それらを同じ globalIndex として共有することで
 * 1 件のマッチとしてカウントできるようにしている。
 */
export const computeMatchesForPage = (
  pageIndex: number,
  textItems: string[],
  escapedQuery: string,
  startGlobalIndex: number,
): { matches: PDFSearchMatch[]; nextGlobalIndex: number } => {
  const normalizedTextItems = textItems.map(normalize)
  const joinedPageText = normalizedTextItems.join('')
  if (joinedPageText.length === 0) return { matches: [], nextGlobalIndex: startGlobalIndex }

  const matches: PDFSearchMatch[] = []
  let globalIndex = startGlobalIndex

  for (const m of joinedPageText.matchAll(new RegExp(escapedQuery, 'gi'))) {
    const matchStart = m.index // joinedPageText 上の開始位置
    const matchEnd = matchStart + m[0].length // joinedPageText 上の終了位置

    // 現在の textItem が joinedPageText 上のどの位置から始まるかのカーソル
    let itemStart = 0

    // joinedPageText 上のマッチ範囲 [matchStart, matchEnd) を textItem 単位の fragment に分解するため、
    // textItem を先頭から順に走査し、マッチ範囲と各 textItem 範囲の重なり部分を 1 件ずつ push していく。
    // マッチ範囲を通り過ぎた以降の textItem は重ならないので break する。
    for (let i = 0; i < normalizedTextItems.length; i++) {
      const itemEnd = itemStart + normalizedTextItems[i].length // joinedPageText 上の現在の textItem の終了位置
      if (itemStart >= matchEnd) break

      const overlapStart = Math.max(matchStart, itemStart) // マッチ範囲と現在の textItem との重なりの開始位置
      const overlapEnd = Math.min(matchEnd, itemEnd) // マッチ範囲と現在の textItem との重なりの終了位置
      if (overlapEnd > overlapStart) {
        matches.push({
          pageIndex,
          itemIndex: i,
          matchStart: overlapStart - itemStart,
          matchLength: overlapEnd - overlapStart,
          globalIndex,
        })
      }
      itemStart = itemEnd
    }
    globalIndex++
  }
  return { matches, nextGlobalIndex: globalIndex }
}

export const usePDFSearch = (fileUrl: string) => {
  const [query, setQueryState] = useState('')
  const [matches, setMatches] = useState<PDFSearchMatch[]>([])
  const [matchCount, setMatchCount] = useState(0)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1)
  const pageTextsRef = useRef<Map<number, string[]>>(new Map())
  const queryRef = useRef('')

  const recalculate = useCallback((nextQuery: string) => {
    if (nextQuery === '') {
      setMatches([])
      setMatchCount(0)
      setCurrentMatchIndex(-1)
      return
    }
    const escapedQuery = escapeRegExp(normalize(nextQuery))
    const pageIndices = Array.from(pageTextsRef.current.keys()).sort((a, b) => a - b)
    const collected: PDFSearchMatch[] = []
    let globalIndex = 0
    for (const pageIndex of pageIndices) {
      const texts = pageTextsRef.current.get(pageIndex)
      if (!texts) continue
      const { matches: pageMatches, nextGlobalIndex } = computeMatchesForPage(
        pageIndex,
        texts,
        escapedQuery,
        globalIndex,
      )
      collected.push(...pageMatches)
      globalIndex = nextGlobalIndex
    }
    setMatches(collected)
    setMatchCount(globalIndex)
    setCurrentMatchIndex((prev) => {
      if (globalIndex === 0) return -1
      if (prev < 0 || prev >= globalIndex) return 0
      return prev
    })
  }, [])

  const setQuery = useCallback(
    (nextQuery: string) => {
      queryRef.current = nextQuery
      setQueryState(nextQuery)
      recalculate(nextQuery)
    },
    [recalculate],
  )

  const registerPageText = useCallback(
    (pageIndex: number, texts: string[]) => {
      pageTextsRef.current.set(pageIndex, texts)
      // ページ数が多い PDF だと全てのページを読み込む前に検索が始まる事を考慮して、後から読み込んだページ分もヒットできるようにしている。
      if (queryRef.current !== '') {
        recalculate(queryRef.current)
      }
    },
    [recalculate],
  )

  const clear = useCallback(() => {
    queryRef.current = ''
    setQueryState('')
    setMatches([])
    setMatchCount(0)
    setCurrentMatchIndex(-1)
  }, [])

  const goNext = useCallback(() => {
    setCurrentMatchIndex((prev) => {
      if (matchCount === 0) return -1
      return (prev + 1) % matchCount
    })
  }, [matchCount])

  const goPrev = useCallback(() => {
    setCurrentMatchIndex((prev) => {
      if (matchCount === 0) return -1
      return (prev - 1 + matchCount) % matchCount
    })
  }, [matchCount])

  // ファイルが変わったら全リセット
  useEffect(() => {
    pageTextsRef.current.clear()
    queryRef.current = ''
    setQueryState('')
    setMatches([])
    setMatchCount(0)
    setCurrentMatchIndex(-1)
  }, [fileUrl])

  return useMemo(
    () => ({
      query,
      setQuery,
      matches,
      matchCount,
      currentMatchIndex,
      goNext,
      goPrev,
      clear,
      registerPageText,
    }),
    [
      query,
      setQuery,
      matches,
      matchCount,
      currentMatchIndex,
      goNext,
      goPrev,
      clear,
      registerPageText,
    ],
  )
}
