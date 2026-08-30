import { renderHook } from '@testing-library/react'

import { useAnimationFrame } from './useAnimationFrame'

describe('useAnimationFrame', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requestを呼ぶとrequestAnimationFrameでcallbackが実行される', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 1
    })

    const { result } = renderHook(() => useAnimationFrame())
    const callback = vi.fn()

    result.current.request(callback)

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('requestを連続して呼ぶと前回予約したフレームがcancelされる', () => {
    let idCounter = 0
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => ++idCounter)
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame')

    const { result } = renderHook(() => useAnimationFrame())

    result.current.request(() => {})
    result.current.request(() => {})

    expect(cancelAnimationFrameSpy).toHaveBeenCalledTimes(1)
    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(1)
  })

  it('cancelを呼ぶと予約中のフレームがcancelされる', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1)
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame')

    const { result } = renderHook(() => useAnimationFrame())

    result.current.request(() => {})
    result.current.cancel()

    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(1)
  })

  it('予約前にcancelを呼んでも何も起きない', () => {
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame')

    const { result } = renderHook(() => useAnimationFrame())

    result.current.cancel()

    expect(cancelAnimationFrameSpy).not.toHaveBeenCalled()
  })

  it('再レンダリングされてもrequest/cancelの参照が変わらない', () => {
    const { result, rerender } = renderHook(() => useAnimationFrame())
    const firstRequest = result.current.request
    const firstCancel = result.current.cancel

    rerender()

    expect(result.current.request).toBe(firstRequest)
    expect(result.current.cancel).toBe(firstCancel)
  })
})
