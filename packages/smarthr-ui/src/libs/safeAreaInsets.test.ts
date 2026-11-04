import { getSafeAreaInsets } from './safeAreaInsets'

describe('getSafeAreaInsets', () => {
  beforeEach(() => {
    // HINT: キャッシュはモジュールスコープで共有されるため、resizeイベントで破棄して各テストを独立させる
    window.dispatchEvent(new Event('resize'))
  })

  afterEach(() => vi.restoreAllMocks())

  it('env(safe-area-inset-*)の値をpx単位で返すこと', () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      paddingTop: '59px',
      paddingRight: '0px',
      paddingBottom: '34px',
      paddingLeft: '0px',
    } as CSSStyleDeclaration)

    expect(getSafeAreaInsets()).toEqual({ top: 59, right: 0, bottom: 34, left: 0 })
  })

  it('env()に対応していない環境では、全て0を返すこと', () => {
    expect(getSafeAreaInsets()).toEqual({ top: 0, right: 0, bottom: 0, left: 0 })
  })

  it('算出した値をキャッシュし、再度算出しないこと', () => {
    const spy = vi.spyOn(window, 'getComputedStyle')

    const first = getSafeAreaInsets()
    const second = getSafeAreaInsets()

    expect(second).toBe(first)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('resizeイベントの発生後は、値を再算出すること', () => {
    const spy = vi.spyOn(window, 'getComputedStyle')

    getSafeAreaInsets()
    window.dispatchEvent(new Event('resize'))
    getSafeAreaInsets()

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('算出用の要素をDOMに残さないこと', () => {
    const childCount = document.body.childElementCount

    getSafeAreaInsets()

    expect(document.body.childElementCount).toBe(childCount)
  })
})
