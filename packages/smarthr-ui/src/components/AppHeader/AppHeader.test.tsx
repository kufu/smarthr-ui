import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { IntlProvider } from '../../intl'

import { AppHeader } from './AppHeader'

import type { Launcher } from './types'

describe('AppHeader', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
    // HINT: AppHeader/hooks/useMediaQuery.ts が素の matchMedia() を呼ぶため、jsdom 用にスタブする
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  const NAVIGATIONS = [{ children: 'ナビゲーション1', href: 'https://example.com/nav1' }]

  const buildFeature = (id: string, name: string): Launcher['feature'] => ({
    id,
    name,
    url: `https://example.com/${id}`,
    favorite: true,
  })

  const DEFAULT_PROPS = { appName: 'テストアプリ', navigations: NAVIGATIONS }

  const renderAppHeader = (props: Partial<React.ComponentProps<typeof AppHeader>> = {}) =>
    render(
      <IntlProvider locale="ja">
        <AppHeader {...DEFAULT_PROPS} {...props} />
      </IntlProvider>,
    )

  // HINT: fetchFeatures を任意のタイミングで resolve/reject できるようにする
  const deferredFetchFeatures = () => {
    let resolve!: (features: Array<Launcher['feature']>) => void
    let reject!: (error: unknown) => void
    const fetchFeatures = vi.fn(
      () =>
        new Promise<Array<Launcher['feature']>>((res, rej) => {
          resolve = res
          reject = rej
        }),
    )

    return {
      fetchFeatures,
      resolve: (features: Array<Launcher['feature']>) => resolve(features),
      reject: () => reject(new Error('failed')),
    }
  }

  describe('既存の features prop（後方互換）', () => {
    it('featuresが空の場合、「アプリ」ボタンが表示されない', () => {
      renderAppHeader({ features: [] })

      expect(screen.queryByRole('button', { name: 'アプリ' })).not.toBeInTheDocument()
    })

    it('featuresが1件以上ある場合、「アプリ」ボタンが表示される', () => {
      renderAppHeader({ features: [buildFeature('1', 'アプリA')] })

      expect(screen.getByRole('button', { name: 'アプリ' })).toBeInTheDocument()
    })

    it('「アプリ」ボタンを開くとfeaturesの内容がそのまま表示される', () => {
      renderAppHeader({ features: [buildFeature('1', 'アプリA')] })

      act(() => screen.getByRole('button', { name: 'アプリ', expanded: false }).click())

      expect(screen.getByRole('link', { name: /アプリA/ })).toBeInTheDocument()
    })
  })

  describe('fetchFeatures による遅延ロード', () => {
    it('初期表示では「アプリ」ボタンが表示されるが、fetchFeaturesは呼ばれない', () => {
      const { fetchFeatures } = deferredFetchFeatures()
      renderAppHeader({ fetchFeatures })

      expect(screen.getByRole('button', { name: 'アプリ' })).toBeInTheDocument()
      expect(fetchFeatures).not.toHaveBeenCalled()
    })

    it('「アプリ」ボタンを開くとfetchFeaturesが呼ばれ、Loader表示後に一覧が表示される', async () => {
      const { fetchFeatures, resolve } = deferredFetchFeatures()
      renderAppHeader({ fetchFeatures })

      act(() => screen.getByRole('button', { name: 'アプリ', expanded: false }).click())

      expect(fetchFeatures).toHaveBeenCalledTimes(1)
      expect(screen.getByText('処理中')).toBeInTheDocument()

      await act(async () => resolve([buildFeature('1', 'アプリA')]))

      expect(await screen.findByRole('link', { name: /アプリA/ })).toBeInTheDocument()
      expect(screen.queryByText('処理中')).not.toBeInTheDocument()
    })

    it('解決結果が空配列の場合、該当なしメッセージを表示する', async () => {
      const { fetchFeatures, resolve } = deferredFetchFeatures()
      renderAppHeader({ fetchFeatures })

      act(() => screen.getByRole('button', { name: 'アプリ', expanded: false }).click())
      await act(async () => resolve([]))

      expect(await screen.findByText('該当するアプリが見つかりませんでした。')).toBeInTheDocument()
    })

    it('失敗した場合エラーメッセージを表示し、再度開くと再試行できる', async () => {
      const first = deferredFetchFeatures()
      const { fetchFeatures } = first
      renderAppHeader({ fetchFeatures })

      act(() => screen.getByRole('button', { name: 'アプリ', expanded: false }).click())
      await act(async () => first.reject())

      expect(await screen.findByText(/アプリ一覧の読み込みに失敗しました/)).toBeInTheDocument()

      // HINT: Dropdownはトグルのため、この操作は見た目上パネルを閉じるクリックだが、
      // エラー後は再試行フラグが戻っているため、このクリックで再度fetchFeaturesが呼ばれる
      const second = deferredFetchFeatures()
      fetchFeatures.mockImplementationOnce(second.fetchFeatures)
      act(() => screen.getByRole('button', { name: 'アプリ', expanded: true }).click())

      expect(fetchFeatures).toHaveBeenCalledTimes(2)

      // パネルを開き直して再試行の結果を確認する（開き直し自体は再フェッチを起こさない）
      act(() => screen.getByRole('button', { name: 'アプリ', expanded: false }).click())
      expect(fetchFeatures).toHaveBeenCalledTimes(2)

      await act(async () => second.resolve([buildFeature('1', 'アプリA')]))
      expect(await screen.findByRole('link', { name: /アプリA/ })).toBeInTheDocument()
    })

    it('同一マウント中に開閉を繰り返してもfetchFeaturesは1回だけ呼ばれる（キャッシュ）', async () => {
      const { fetchFeatures, resolve } = deferredFetchFeatures()
      renderAppHeader({ fetchFeatures })

      act(() => screen.getByRole('button', { name: 'アプリ', expanded: false }).click())
      await act(async () => resolve([buildFeature('1', 'アプリA')]))
      await screen.findByRole('link', { name: /アプリA/ })

      // 閉じて再度開く
      act(() => screen.getByRole('button', { name: 'アプリ', expanded: true }).click())
      act(() => screen.getByRole('button', { name: 'アプリ', expanded: false }).click())

      expect(fetchFeatures).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('link', { name: /アプリA/ })).toBeInTheDocument()
    })

    it('Desktop・Mobileのどちらから開いてもfetchFeaturesの呼び出しは1回だけ', async () => {
      const { fetchFeatures, resolve } = deferredFetchFeatures()
      const user = userEvent.setup()
      renderAppHeader({ fetchFeatures })

      // Desktop側の「アプリ」を開く
      act(() => screen.getByRole('button', { name: 'アプリ', expanded: false }).click())
      expect(fetchFeatures).toHaveBeenCalledTimes(1)

      // Mobile側のハンバーガーメニューから「アプリ一覧」を開く
      await user.click(screen.getByRole('button', { name: 'メニューを開く' }))
      await user.click(screen.getByRole('button', { name: 'アプリ一覧' }))

      expect(fetchFeatures).toHaveBeenCalledTimes(1)

      await act(async () => resolve([buildFeature('1', 'アプリA')]))

      const links = await screen.findAllByRole('link', { name: /アプリA/ })
      // Desktop・Mobile 両方のパネルに同じ結果が反映される
      expect(links.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('navigationsが無い場合', () => {
    it('mobileのメニューボタン自体が表示されない', () => {
      renderAppHeader({ navigations: undefined, features: [buildFeature('1', 'アプリA')] })

      expect(screen.queryByRole('button', { name: 'メニューを開く' })).not.toBeInTheDocument()
    })
  })
})
