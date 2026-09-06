import { type ChangeEvent, type ComponentProps, type KeyboardEvent, useMemo, useState } from 'react'

import { useLatest } from '../../hooks/useLatest'

import { buildCustomTextRenderer } from './buildCustomTextRenderer'

import type { PDFSearchMatch } from './types'
import type { Page } from 'react-pdf'

type PDFTextContent = Parameters<
  NonNullable<ComponentProps<typeof Page>['onGetTextSuccess']>
>[number]

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
  const [pageTexts, setPageTexts] = useState<Map<number, string[]>>(() => new Map())
  const [prevFileUrl, setPrevFileUrl] = useState(fileUrl)

  const matchCount = matches.length === 0 ? 0 : matches[matches.length - 1].globalIndex + 1

  const latest = useLatest({ matchCount, query, pageTexts })

  const functions = useMemo(() => {
    const resetMatchState = () => {
      setMatches([])
      setCurrentMatchIndex(-1)
    }

    const recalculate = (
      texts: Map<number, string[]>,
      nextQuery: string,
      options?: { resetSelection?: boolean },
    ) => {
      if (nextQuery === '') {
        resetMatchState()
        return
      }
      const escapedQuery = escapeRegExp(normalize(nextQuery))
      const pageIndices = Array.from(texts.keys()).sort((a, b) => a - b)
      const collected: PDFSearchMatch[] = []
      let globalIndex = 0
      for (const pageIndex of pageIndices) {
        const pageTextItems = texts.get(pageIndex)
        if (!pageTextItems) continue
        const { matches: pageMatches, nextGlobalIndex } = computeMatchesForPage(
          pageIndex,
          pageTextItems,
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
    }

    const goNext = () => {
      setCurrentMatchIndex((prev) => {
        if (latest.matchCount === 0) return -1
        if (prev < 0) return 0
        return (prev + 1) % latest.matchCount
      })
    }

    const goPrev = () => {
      setCurrentMatchIndex((prev) => {
        if (latest.matchCount === 0) return -1
        if (prev < 0) return latest.matchCount - 1
        return (prev - 1 + latest.matchCount) % latest.matchCount
      })
    }

    return {
      resetMatchState,
      goNext,
      goPrev,
      handleChangeQuery: (e: ChangeEvent<HTMLInputElement>) => {
        const nextQuery = e.target.value

        setQueryState(nextQuery)
        recalculate(latest.pageTexts, nextQuery, { resetSelection: true })
      },
      handleKeyDownQuery: (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) {
          return
        }
        switch (e.key) {
          case 'Enter': {
            e.preventDefault()
            if (e.shiftKey) {
              goPrev()
            } else {
              goNext()
            }
            break
          }
          case 'Escape': {
            if (latest.query !== '') {
              e.preventDefault()
              setQueryState('')
              resetMatchState()
            }
            break
          }
        }
      },
      generateHandlePDFPageGetTextSuccess: (pageIndex: number) => (textContent: PDFTextContent) => {
        const texts = textContent.items.reduce<string[]>((acc, item) => {
          if ('str' in item) {
            acc.push(item.str)
          }
          return acc
        }, [])
        const nextPageTexts = new Map(latest.pageTexts)
        nextPageTexts.set(pageIndex, texts.map(normalize))
        setPageTexts(nextPageTexts)
        // 全ページ読み込み前に検索が始まっても、後から読んだページがヒットするよう再計算する。
        if (latest.query !== '') {
          recalculate(nextPageTexts, latest.query)
        }
      },
    }
  }, [latest])

  if (prevFileUrl !== fileUrl) {
    setPrevFileUrl(fileUrl)
    setPageTexts(new Map())
    setQueryState('')
    functions.resetMatchState()
  }

  const customTextRenderer = useMemo(() => {
    if (matches.length === 0) {
      return undefined
    }
    return buildCustomTextRenderer(matches)
  }, [matches])

  return useMemo(
    () => ({
      query,
      matches,
      matchCount,
      currentMatchIndex,
      customTextRenderer,
      goNext: functions.goNext,
      goPrev: functions.goPrev,
      handleChangeQuery: functions.handleChangeQuery,
      handleKeyDownQuery: functions.handleKeyDownQuery,
      generateHandlePDFPageGetTextSuccess: functions.generateHandlePDFPageGetTextSuccess,
    }),
    [query, matches, matchCount, currentMatchIndex, customTextRenderer, functions],
  )
}

export type UsePDFSearch = ReturnType<typeof usePDFSearch>
