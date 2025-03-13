import { useCallback, useEffect, useState } from 'react'

import type { Launcher } from '../types'

export const useAppLauncher = (baseFeatures: Array<Launcher['feature']>) => {
  const [page, setPage] = useState<Launcher['page']>('favorite')
  const [mode, setMode] = useState<Launcher['mode']>('default')
  const [sortType, setSortType] = useState<Launcher['sortType']>('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [features, setFeatures] = useState<Array<Launcher['feature']>>(
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

  const changePage = useCallback((newPage: Launcher['page']) => {
    setPage(newPage)
    setMode('default')
    setSearchQuery('')
  }, [])

  const changeSearchQuery = useCallback(
    (q: string) => {
      setSearchQuery(q)

      if (mode !== 'search') {
        setMode('search')
      } else if (q === '') {
        setMode('default')
      }
    },
    [mode],
  )

  return { features, page, mode, sortType, searchQuery, changePage, setSortType, changeSearchQuery }
}

const sortFeatures = (
  features: Array<Launcher['feature']>,
  {
    page,
    sortType,
    mode,
    searchQuery,
  }: {
    page: Launcher['page']
    sortType: Launcher['sortType']
    mode: Launcher['mode']
    searchQuery: string
  },
) => {
  if (mode !== 'search' && page === 'favorite') {
    const filtered = features.filter((item) => item.favorite)

    // feature の position の数値の順に並び替える。position が null の場合は最後に並べる
    return filtered.sort((a, b) => {
      if (a.position === null) {
        if (b.position === null) {
          return 0
        }

        return 1
      } else if (b.position === null) {
        return -1
      }

      return a.position - b.position
    })
  }

  const looseSearchQuery = normalize(searchQuery)
  const featuresRes =
    mode === 'search'
      ? features.filter((feature) => looseInclude(looseSearchQuery, feature.name))
      : [...features]

  switch (sortType) {
    case 'name/asc':
      return featuresRes.sort((a, b) => a.name.localeCompare(b.name))
    case 'name/desc':
      return featuresRes.sort((a, b) => b.name.localeCompare(a.name))
  }

  return featuresRes
}

export const looseInclude = (looseSearchQuery: string, featureName: string) =>
  // HINT: normalizeは1文字ずつ変換処理を行う関係で思いため、変換せずにマッチするかどうかを確認する
  featureName.includes(looseSearchQuery) || normalize(featureName).includes(looseSearchQuery)

// アルファベットの大文字小文字は同じものとして扱う。カタカナとひらがなも同じものとして扱う。
const normalize = (str: string) =>
  str.toLowerCase().replace(NORMALIZE_REGEX, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))

const NORMALIZE_REGEX = /[\u30a1-\u30f6]/g
