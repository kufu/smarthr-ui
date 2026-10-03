import { renderHook } from '@testing-library/react'

import { useMergeRefs } from './useMergeRefs'

import type { MutableRefObject } from 'react'

describe('useMergeRefs', () => {
  test('RefObjectとcallback refの両方にnodeを設定する', () => {
    const objectRef: MutableRefObject<string | null> = { current: null }
    const callbackRef = vi.fn()

    const { result } = renderHook(() => useMergeRefs(objectRef, callbackRef))

    result.current('node')

    expect(objectRef.current).toBe('node')
    expect(callbackRef).toHaveBeenCalledWith('node')
  })

  test('undefinedのrefは無視される', () => {
    const objectRef: MutableRefObject<string | null> = { current: null }

    const { result } = renderHook(() => useMergeRefs(objectRef, undefined))

    expect(() => result.current('node')).not.toThrow()
    expect(objectRef.current).toBe('node')
  })

  test('マウント時は先頭のrefから順に設定されるため、後続のrefのcallbackから前のrefのcurrentを参照できる', () => {
    const innerRef: MutableRefObject<string | null> = { current: null }
    const callbackRef = vi.fn((node: string | null) => {
      expect(innerRef.current).toBe(node)
    })

    const { result } = renderHook(() => useMergeRefs(innerRef, callbackRef))

    result.current('node')

    expect(callbackRef).toHaveBeenCalledWith('node')
  })

  test('アンマウント時はマウント時と逆順でcleanupされる', () => {
    const order: string[] = []
    const first = vi.fn(() => {
      order.push('first-set')
      return () => order.push('first-cleanup')
    })
    const second = vi.fn(() => {
      order.push('second-set')
      return () => order.push('second-cleanup')
    })

    const { result } = renderHook(() => useMergeRefs(first, second))

    const cleanup = result.current('node')
    cleanup?.()

    expect(order).toEqual(['first-set', 'second-set', 'second-cleanup', 'first-cleanup'])
  })

  test('callback refがcleanup関数を返さない場合はアンマウント時にnullで呼び出される', () => {
    const callbackRef = vi.fn()

    const { result } = renderHook(() => useMergeRefs(callbackRef))

    const cleanup = result.current('node')
    cleanup?.()

    expect(callbackRef).toHaveBeenNthCalledWith(1, 'node')
    expect(callbackRef).toHaveBeenNthCalledWith(2, null)
  })

  test('RefObjectはアンマウント時にcurrentがnullにリセットされる', () => {
    const objectRef: MutableRefObject<string | null> = { current: null }

    const { result } = renderHook(() => useMergeRefs(objectRef))

    const cleanup = result.current('node')

    expect(objectRef.current).toBe('node')

    cleanup?.()

    expect(objectRef.current).toBeNull()
  })
})
