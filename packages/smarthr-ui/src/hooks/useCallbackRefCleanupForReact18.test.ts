import { renderHook } from '@testing-library/react'

import { useCallbackRefCleanupForReact18 } from './useCallbackRefCleanupForReact18'

describe('useCallbackRefCleanupForReact18', () => {
  test('nodeがtruthyのときcallbackがnode付きで呼ばれる', () => {
    const callback = vi.fn()

    const { result } = renderHook(() => useCallbackRefCleanupForReact18(callback))

    result.current('node')

    expect(callback).toHaveBeenCalledWith('node')
  })

  test('アタッチ前にnodeがnullで呼ばれるとcallbackがnull付きで呼ばれる', () => {
    const callback = vi.fn()

    const { result } = renderHook(() => useCallbackRefCleanupForReact18(callback))

    result.current(null)

    expect(callback).toHaveBeenCalledWith(null)
  })

  test('callbackが返したcleanup関数はnodeがnullで呼ばれたときに実行される', () => {
    const cleanup = vi.fn()
    const callback = vi.fn(() => cleanup)

    const { result } = renderHook(() => useCallbackRefCleanupForReact18(callback))

    result.current('node')
    expect(cleanup).not.toHaveBeenCalled()

    result.current(null)
    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  test('callbackがcleanup関数を返さない場合、nodeがnullで呼ばれるとcallback自体がnull付きで呼ばれる', () => {
    const callback = vi.fn()

    const { result } = renderHook(() => useCallbackRefCleanupForReact18(callback))

    result.current('node')
    result.current(null)

    expect(callback).toHaveBeenNthCalledWith(2, null)
  })

  test('再アタッチ時は新しいcleanup関数に差し替わる', () => {
    const firstCleanup = vi.fn()
    const secondCleanup = vi.fn()
    const callback = vi.fn().mockReturnValueOnce(firstCleanup).mockReturnValueOnce(secondCleanup)

    const { result } = renderHook(() => useCallbackRefCleanupForReact18(callback))

    result.current('first')
    result.current(null)
    expect(firstCleanup).toHaveBeenCalledTimes(1)

    result.current('second')
    result.current(null)
    expect(secondCleanup).toHaveBeenCalledTimes(1)
    expect(firstCleanup).toHaveBeenCalledTimes(1)
  })

  test('callbackの参照が変わらなければ返り値の関数は同一の参照を保つ', () => {
    const callback = vi.fn()

    const { result, rerender } = renderHook(() => useCallbackRefCleanupForReact18(callback))

    const first = result.current
    rerender()
    const second = result.current

    expect(first).toBe(second)
  })

  test('callbackの参照が変わると返り値の関数の参照も変わる', () => {
    const firstCallback = vi.fn()
    const secondCallback = vi.fn()

    const { result, rerender } = renderHook(
      ({ callback }) => useCallbackRefCleanupForReact18(callback),
      { initialProps: { callback: firstCallback } },
    )

    const first = result.current
    rerender({ callback: secondCallback })
    const second = result.current

    expect(first).not.toBe(second)
  })
})
