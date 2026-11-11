import { renderHook } from '@testing-library/react'

import { useSafeAreaInsets } from './useSafeAreaInsets'

describe('useSafeAreaInsets', () => {
  afterEach(() => vi.restoreAllMocks())

  it('env(safe-area-inset-*)の値をpx単位で返すこと', () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      paddingTop: '59px',
      paddingRight: '0px',
      paddingBottom: '34px',
      paddingLeft: '0px',
    } as CSSStyleDeclaration)

    const { result, unmount } = renderHook(() => useSafeAreaInsets())

    expect(result.current()).toEqual({ top: 59, right: 0, bottom: 34, left: 0 })

    unmount()
  })

  it('env()に対応していない環境では、全て0を返すこと', () => {
    const { result, unmount } = renderHook(() => useSafeAreaInsets())

    expect(result.current()).toEqual({ top: 0, right: 0, bottom: 0, left: 0 })

    unmount()
  })

  it('再レンダリングしても同じ関数を返すこと', () => {
    const { result, rerender, unmount } = renderHook(() => useSafeAreaInsets())
    const first = result.current

    rerender()

    expect(result.current).toBe(first)

    unmount()
  })

  it('マウント中は算出した値をキャッシュし、複数のコンポーネントで共有すること', () => {
    const spy = vi.spyOn(window, 'getComputedStyle')
    const a = renderHook(() => useSafeAreaInsets())
    const b = renderHook(() => useSafeAreaInsets())

    const first = a.result.current()
    const second = b.result.current()

    expect(second).toBe(first)
    expect(spy).toHaveBeenCalledTimes(1)

    a.unmount()
    b.unmount()
  })

  it('resizeイベントの発生後は、値を再算出すること', () => {
    const spy = vi.spyOn(window, 'getComputedStyle')
    const { result, unmount } = renderHook(() => useSafeAreaInsets())

    result.current()
    window.dispatchEvent(new Event('resize'))
    result.current()

    expect(spy).toHaveBeenCalledTimes(2)

    unmount()
  })

  it('全てアンマウントされた後は、キャッシュを使わずに算出すること', () => {
    const spy = vi.spyOn(window, 'getComputedStyle')
    const { result, unmount } = renderHook(() => useSafeAreaInsets())
    const getSafeAreaInsets = result.current

    getSafeAreaInsets()
    unmount()
    getSafeAreaInsets()
    getSafeAreaInsets()

    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('全てアンマウントされた後は、resizeイベントの監視を解除すること', () => {
    const spy = vi.spyOn(window, 'removeEventListener')
    const a = renderHook(() => useSafeAreaInsets())
    const b = renderHook(() => useSafeAreaInsets())

    a.unmount()
    expect(spy).not.toHaveBeenCalledWith('resize', expect.any(Function), expect.anything())

    b.unmount()
    expect(spy).toHaveBeenCalledWith('resize', expect.any(Function), expect.anything())
  })

  it('算出用の要素をDOMに残さないこと', () => {
    const { result, unmount } = renderHook(() => useSafeAreaInsets())
    const childCount = document.body.childElementCount

    result.current()

    expect(document.body.childElementCount).toBe(childCount)

    unmount()
  })
})
