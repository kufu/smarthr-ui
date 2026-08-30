import { act, renderHook } from '@testing-library/react'

import { useMediaQueries } from './useMediaQueries'

class MockMediaQueryList {
  matches: boolean
  readonly media: string
  private listeners = new Set<(event: MediaQueryListEvent) => void>()

  constructor(media: string, matches: boolean) {
    this.media = media
    this.matches = matches
  }

  addEventListener(type: string, listener: (event: MediaQueryListEvent) => void) {
    if (type === 'change') {
      this.listeners.add(listener)
    }
  }

  removeEventListener(type: string, listener: (event: MediaQueryListEvent) => void) {
    if (type === 'change') {
      this.listeners.delete(listener)
    }
  }

  dispatch(matches: boolean) {
    this.matches = matches
    this.listeners.forEach((listener) =>
      listener({ matches, media: this.media } as MediaQueryListEvent),
    )
  }

  get listenerCount() {
    return this.listeners.size
  }
}

describe('useMediaQueries', () => {
  let mediaQueryLists: Map<string, MockMediaQueryList>
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    mediaQueryLists = new Map()
    originalMatchMedia = window.matchMedia

    window.matchMedia = vi.fn((query: string) => {
      const mql = mediaQueryLists.get(query) ?? new MockMediaQueryList(query, false)
      mediaQueryLists.set(query, mql)
      return mql as unknown as MediaQueryList
    })
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  test('各クエリの現在のmatches状態を返す', () => {
    mediaQueryLists.set('(min-width: 600px)', new MockMediaQueryList('(min-width: 600px)', true))
    mediaQueryLists.set('(min-width: 900px)', new MockMediaQueryList('(min-width: 900px)', false))

    const { result } = renderHook(() =>
      useMediaQueries({ isTablet: '(min-width: 600px)', isDesktop: '(min-width: 900px)' }),
    )

    expect(result.current).toEqual({ isTablet: true, isDesktop: false })
  })

  test('メディアクエリのchangeイベントで最新の状態に更新される', () => {
    const mql = new MockMediaQueryList('(min-width: 600px)', false)
    mediaQueryLists.set('(min-width: 600px)', mql)

    const { result } = renderHook(() => useMediaQueries({ isTablet: '(min-width: 600px)' }))

    expect(result.current).toEqual({ isTablet: false })

    act(() => {
      mql.dispatch(true)
    })

    expect(result.current).toEqual({ isTablet: true })
  })

  test('queriesが変わると新しいクエリを購読し直し、古いクエリの購読は解除される', () => {
    const narrow = new MockMediaQueryList('(min-width: 600px)', true)
    const wide = new MockMediaQueryList('(min-width: 900px)', false)
    mediaQueryLists.set('(min-width: 600px)', narrow)
    mediaQueryLists.set('(min-width: 900px)', wide)

    const { result, rerender } = renderHook(({ query }) => useMediaQueries({ matched: query }), {
      initialProps: { query: '(min-width: 600px)' },
    })

    expect(result.current).toEqual({ matched: true })

    rerender({ query: '(min-width: 900px)' })

    expect(result.current).toEqual({ matched: false })

    act(() => {
      wide.dispatch(true)
    })

    expect(result.current).toEqual({ matched: true })

    act(() => {
      narrow.dispatch(false)
    })

    // 古いクエリの購読は解除済みのため、結果に影響しない
    expect(result.current).toEqual({ matched: true })
  })

  test('unmount時にすべてのメディアクエリの購読を解除する', () => {
    const mql = new MockMediaQueryList('(min-width: 600px)', false)
    mediaQueryLists.set('(min-width: 600px)', mql)

    const { unmount } = renderHook(() => useMediaQueries({ isTablet: '(min-width: 600px)' }))

    expect(mql.listenerCount).toBe(1)

    unmount()

    expect(mql.listenerCount).toBe(0)
  })

  test('window.matchMediaが存在しない場合はすべてfalseを返す', () => {
    // @ts-expect-error SSR環境を模倣するため意図的にundefinedにする
    window.matchMedia = undefined

    const { result } = renderHook(() =>
      useMediaQueries({ isTablet: '(min-width: 600px)', isDesktop: '(min-width: 900px)' }),
    )

    expect(result.current).toEqual({ isTablet: false, isDesktop: false })
  })
})
