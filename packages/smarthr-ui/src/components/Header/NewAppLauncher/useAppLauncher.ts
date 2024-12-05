import { useCallback, useEffect, useState } from 'react'

import { Feature, Mode, Page, SortType } from './constants'

export const useAppLauncher = (baseFeatures: Feature[]) => {
  const [page, setPage] = useState<Page>('favorite')
  const [mode, setMode] = useState<Mode>('default')
  const [sortType, setSortType] = useState<SortType>('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [features, setFeatures] = useState<Feature[]>(
    sortFeatures(baseFeatures, {
      page,
      mode,
      sortType,
      searchQuery,
    }),
  )

  useEffect(() => {
    setFeatures(
      sortFeatures(baseFeatures, {
        page,
        sortType,
        mode,
        searchQuery,
      }),
    )
  }, [baseFeatures, page, mode, sortType, searchQuery])

  const changePage = useCallback((newPage: Page) => {
    setPage(newPage)
    setMode('default')
    setSearchQuery('')
  }, [])

  const changeSearchQuery = useCallback(
    (q: string) => {
      setSearchQuery(q)

      if (mode !== 'search') {
        setMode('search')
      } else {
        if (q === '') {
          setMode('default')
        }
      }
    },
    [mode],
  )

  return { features, page, mode, sortType, searchQuery, changePage, setSortType, changeSearchQuery }
}

const sortFeatures = (
  features: Feature[],
  {
    page,
    sortType,
    mode,
    searchQuery,
  }: {
    page: Page
    sortType: SortType
    mode: Mode
    searchQuery: string
  },
) => {
  if (mode !== 'search' && page === 'favorite') {
    const filtered = features.filter((item) => item.favorite)

    // feature の position の数値の順に並び替える。position が null の場合は最後に並べる
    return filtered.sort((a, b) => {
      if (a.position === null && b.position === null) {
        return 0
      } else if (a.position === null) {
        return 1
      } else if (b.position === null) {
        return -1
      } else {
        return a.position - b.position
      }
    })
  }

  const featuresRes =
    mode === 'search'
      ? features.filter((feature) => looseInclude(feature.name, searchQuery))
      : [...features]

  if (sortType === 'name/asc') {
    featuresRes.sort((a, b) => a.name.localeCompare(b.name))
  }

  if (sortType === 'name/desc') {
    featuresRes.sort((a, b) => b.name.localeCompare(a.name))
  }

  return featuresRes
}

// 文字列 a が文字列 b を含んでいたら true を返す
export const looseInclude = (a: string, b: string) => {
  const normalizedA = normalize(a)
  const normalizedB = normalize(b)
  return normalizedA.includes(normalizedB)
}

// アルファベットの大文字小文字は同じものとして扱う。カタカナとひらがなも同じものとして扱う。
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\u30a1-\u30f6]/g, (match) => String.fromCharCode(match.charCodeAt(0) - 0x60))
