import { act, render, screen } from '@testing-library/react'

import { EnvironmentProvider } from './EnvironmentProvider'
import { useEnvironment } from './useEnvironment'

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

// EnvironmentProviderが実際に監視するクエリ（themes/createMediaQuery.tsのdefaultMediaQuery）
const SCREEN_SMALL_QUERY = '(width <= 751px)'

const Consumer = () => {
  const { mobile, matches } = useEnvironment()

  return <div data-testid="consumer" data-mobile={mobile} data-matches={JSON.stringify(matches)} />
}

const getConsumerState = () => {
  const el = screen.getByTestId('consumer')

  return {
    mobile: el.getAttribute('data-mobile'),
    matches: JSON.parse(el.getAttribute('data-matches')!),
  }
}

describe('EnvironmentProvider', () => {
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

  test('各メディアクエリの現在のmatches状態がuseEnvironment経由で取得できる', () => {
    mediaQueryLists.set(SCREEN_SMALL_QUERY, new MockMediaQueryList(SCREEN_SMALL_QUERY, true))

    render(
      <EnvironmentProvider>
        <Consumer />
      </EnvironmentProvider>,
    )

    const { mobile, matches } = getConsumerState()

    expect(matches.SCREEN_SMALL).toBe(true)
    // environmentでmobileが指定されていない場合、matches.SCREEN_SMALLがmobileとして使われる
    expect(mobile).toBe('true')
  })

  test('メディアクエリのchangeイベントで最新の状態に更新される', () => {
    const mql = new MockMediaQueryList(SCREEN_SMALL_QUERY, false)
    mediaQueryLists.set(SCREEN_SMALL_QUERY, mql)

    render(
      <EnvironmentProvider>
        <Consumer />
      </EnvironmentProvider>,
    )

    expect(getConsumerState().matches.SCREEN_SMALL).toBe(false)

    act(() => {
      mql.dispatch(true)
    })

    expect(getConsumerState().matches.SCREEN_SMALL).toBe(true)
  })

  test('unmount時にすべてのメディアクエリの購読を解除する', () => {
    const mql = new MockMediaQueryList(SCREEN_SMALL_QUERY, false)
    mediaQueryLists.set(SCREEN_SMALL_QUERY, mql)

    const { unmount } = render(
      <EnvironmentProvider>
        <Consumer />
      </EnvironmentProvider>,
    )

    expect(mql.listenerCount).toBeGreaterThan(0)

    unmount()

    expect(mql.listenerCount).toBe(0)
  })

  test('window.matchMediaが存在しない場合はすべてfalseを返す', () => {
    // @ts-expect-error SSR環境を模倣するため意図的にundefinedにする
    window.matchMedia = undefined

    render(
      <EnvironmentProvider>
        <Consumer />
      </EnvironmentProvider>,
    )

    const { mobile, matches } = getConsumerState()

    expect(matches.SCREEN_SMALL).toBe(false)
    expect(mobile).toBe('false')
  })

  test('environment propでmobileを明示指定すると、matches由来の値より優先される', () => {
    mediaQueryLists.set(SCREEN_SMALL_QUERY, new MockMediaQueryList(SCREEN_SMALL_QUERY, false))

    render(
      <EnvironmentProvider environment={{ mobile: true }}>
        <Consumer />
      </EnvironmentProvider>,
    )

    const { mobile, matches } = getConsumerState()

    // matches.SCREEN_SMALLはfalseのままだが、明示指定したmobileが優先される
    expect(matches.SCREEN_SMALL).toBe(false)
    expect(mobile).toBe('true')
  })

  test('ネストしたEnvironmentProviderでは、内側で指定していない値を外側から継承する', () => {
    mediaQueryLists.set(SCREEN_SMALL_QUERY, new MockMediaQueryList(SCREEN_SMALL_QUERY, false))

    render(
      <EnvironmentProvider environment={{ mobile: true }}>
        <EnvironmentProvider>
          <Consumer />
        </EnvironmentProvider>
      </EnvironmentProvider>,
    )

    // 内側のProviderはmobileを指定していないため、
    // 外側から継承したmobile: trueが優先され、matches.SCREEN_SMALL(false)は使われない
    expect(getConsumerState().mobile).toBe('true')
  })
})
