import { renderHook } from '@testing-library/react'

import { useOnce } from './useOnce'

describe('useOnce', () => {
  test('初回の呼び出しではcallbackが実行される', () => {
    const callback = vi.fn((value: string) => value.toUpperCase())

    const { result } = renderHook(() => useOnce(callback))

    const returned = result.current('foo')

    expect(callback).toHaveBeenCalledWith('foo')
    expect(returned).toBe('FOO')
  })

  test('2回目以降の呼び出しではcallbackが実行されずundefinedを返す', () => {
    const callback = vi.fn((value: string) => value.toUpperCase())

    const { result } = renderHook(() => useOnce(callback))

    result.current('foo')
    const returned = result.current('bar')

    expect(callback).toHaveBeenCalledTimes(1)
    expect(returned).toBeUndefined()
  })

  test('再レンダリングされても実行済みの状態は維持される', () => {
    const callback = vi.fn()

    const { result, rerender } = renderHook(() => useOnce(callback))

    result.current()
    rerender()
    result.current()

    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('再レンダリング後に呼び出すと最新のcallbackが実行される', () => {
    const firstCallback = vi.fn()
    const secondCallback = vi.fn()

    const { result, rerender } = renderHook(({ callback }) => useOnce(callback), {
      initialProps: { callback: firstCallback },
    })

    rerender({ callback: secondCallback })
    result.current()

    expect(firstCallback).not.toHaveBeenCalled()
    expect(secondCallback).toHaveBeenCalledTimes(1)
  })

  test('返り値の関数は再レンダリングされても同一の参照を保つ', () => {
    const { result, rerender } = renderHook(() => useOnce(vi.fn()))

    const first = result.current
    rerender()
    const second = result.current

    expect(first).toBe(second)
  })
})
