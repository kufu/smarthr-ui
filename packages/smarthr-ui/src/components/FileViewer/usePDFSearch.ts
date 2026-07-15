import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useLatest } from '../../hooks/useLatest'

import type { PDFSearchMatch } from './types'

export const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const normalize = (s: string) => s.normalize('NFKC')

// 縦書きは未対応（pdf.js が縦書きの textItem を読み順で返さず、連結すると検索文字列がずれるため）
export const computeMatchesForPage = (
  pageIndex: number,
  normalizedTextItems: string[],
  escapedQuery: string,
  startGlobalIndex: number,
): { matches: PDFSearchMatch[]; nextGlobalIndex: number } => {
  const joinedPageText = normalizedTextItems.join('')
  if (joinedPageText.length === 0) return { matches: [], nextGlobalIndex: startGlobalIndex }

  const matches: PDFSearchMatch[] = []
  let globalIndex = startGlobalIndex

  for (const m of joinedPageText.matchAll(new RegExp(escapedQuery, 'gi'))) {
    const matchStart = m.index
    const matchEnd = matchStart + m[0].length

    let itemStart = 0
    for (let i = 0; i < normalizedTextItems.length; i++) {
      if (itemStart >= matchEnd) break

      const itemEnd = itemStart + normalizedTextItems[i].length

      const overlapStart = Math.max(matchStart, itemStart)
      const overlapEnd = Math.min(matchEnd, itemEnd)
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
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1)
  const pageTextsRef = useRef<Map<number, string[]>>(new Map())

  const matchCount = matches.length === 0 ? 0 : matches[matches.length - 1].globalIndex + 1

  const resetMatchState = useCallback(() => {
    setMatches([])
    setCurrentMatchIndex(-1)
  }, [])

  const latest = useLatest({ matchCount, query, resetMatchState })

  const recalculate = useCallback(
    (nextQuery: string, options?: { resetSelection?: boolean }) => {
      if (nextQuery === '') {
        latest.resetMatchState()
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
      if (options?.resetSelection) {
        setCurrentMatchIndex(-1)
        return
      }
      setCurrentMatchIndex((prev) => {
        if (globalIndex === 0) return -1
        if (prev >= globalIndex) return globalIndex - 1
        return prev
      })
    },
    [latest],
  )

  const setQuery = useCallback(
    (nextQuery: string) => {
      setQueryState(nextQuery)
      recalculate(nextQuery, { resetSelection: true })
    },
    [recalculate],
  )

  const functions = useMemo(
    () => ({
      registerPageText: (pageIndex: number, texts: string[]) => {
        pageTextsRef.current.set(pageIndex, texts.map(normalize))
        // 全ページ読み込み前に検索が始まっても、後から読んだページがヒットするよう再計算する。
        if (latest.query !== '') {
          recalculate(latest.query)
        }
      },
      goNext: () => {
        setCurrentMatchIndex((prev) => {
          const { matchCount: count } = latest

          if (count === 0) return -1
          if (prev < 0) return 0
          return (prev + 1) % count
        })
      },
      goPrev: () => {
        setCurrentMatchIndex((prev) => {
          const { matchCount: count } = latest

          if (count === 0) return -1
          if (prev < 0) return count - 1
          return (prev - 1 + count) % count
        })
      },
      clear: () => {
        setQueryState('')
        latest.resetMatchState()
      },
    }),
    [recalculate, latest],
  )

  useEffect(() => {
    pageTextsRef.current.clear()
    setQueryState('')
    latest.resetMatchState()
  }, [fileUrl, latest])

  return useMemo(
    () => ({
      query,
      setQuery,
      matches,
      matchCount,
      currentMatchIndex,
      goNext: functions.goNext,
      goPrev: functions.goPrev,
      clear: functions.clear,
      registerPageText: functions.registerPageText,
    }),
    [query, setQuery, matches, matchCount, currentMatchIndex, functions],
  )
}

export type UsePDFSearch = ReturnType<typeof usePDFSearch>
