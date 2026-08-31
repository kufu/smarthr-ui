import { render, renderHook } from '@testing-library/react'

import { useMergeRefs } from './useMergeRefs'

import type { MutableRefObject, Ref } from 'react'

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

    result.current('node')
    result.current(null)

    expect(order).toEqual(['first-set', 'second-set', 'second-cleanup', 'first-cleanup'])
  })

  test('callback refがcleanup関数を返さない場合はアンマウント時にnullで呼び出される', () => {
    const callbackRef = vi.fn()

    const { result } = renderHook(() => useMergeRefs(callbackRef))

    result.current('node')
    result.current(null)

    expect(callbackRef).toHaveBeenNthCalledWith(1, 'node')
    expect(callbackRef).toHaveBeenNthCalledWith(2, null)
  })

  test('RefObjectはアンマウント時にcurrentがnullにリセットされる', () => {
    const objectRef: MutableRefObject<string | null> = { current: null }

    const { result } = renderHook(() => useMergeRefs(objectRef))

    result.current('node')

    expect(objectRef.current).toBe('node')

    result.current(null)

    expect(objectRef.current).toBeNull()
  })

  describe('refsの差し替え', () => {
    // 内部のcallback refを模したもの。参照が安定していることが前提
    const createInternalRef = () => {
      const cleanup = vi.fn()
      const setup = vi.fn(() => cleanup)

      return { setup, cleanup }
    }

    const Fixture = ({
      internalRef,
      externalRef,
      hasElement = true,
    }: {
      internalRef: Ref<HTMLDivElement>
      externalRef: Ref<HTMLDivElement>
      hasElement?: boolean
    }) => {
      const mergedRef = useMergeRefs(internalRef, externalRef)

      return hasElement ? <div ref={mergedRef} data-testid="target" /> : <span />
    }

    test('参照が変わっていないrefは再実行されない', () => {
      const internal = createInternalRef()

      const { rerender } = render(
        <Fixture internalRef={internal.setup} externalRef={() => undefined} />,
      )

      expect(internal.setup).toHaveBeenCalledTimes(1)

      // 外部refのみ参照が変わる（利用者がインラインのcallback refを渡した場合と同じ状況）
      rerender(<Fixture internalRef={internal.setup} externalRef={() => undefined} />)

      expect(internal.setup).toHaveBeenCalledTimes(1)
      expect(internal.cleanup).not.toHaveBeenCalled()
    })

    test('参照が変わったrefは旧refがcleanupされ、新refにnodeが設定される', () => {
      const internal = createInternalRef()
      const oldExternalRef = vi.fn()
      const newExternalRef = vi.fn()

      const { rerender, getByTestId } = render(
        <Fixture internalRef={internal.setup} externalRef={oldExternalRef} />,
      )

      const node = getByTestId('target')

      expect(oldExternalRef).toHaveBeenCalledWith(node)

      rerender(<Fixture internalRef={internal.setup} externalRef={newExternalRef} />)

      expect(oldExternalRef).toHaveBeenLastCalledWith(null)
      expect(newExternalRef).toHaveBeenCalledWith(node)
    })

    test('RefObjectが差し替わった場合も旧refのcurrentがnullになり、新refにnodeが設定される', () => {
      const internal = createInternalRef()
      const oldObjectRef: MutableRefObject<HTMLDivElement | null> = { current: null }
      const newObjectRef: MutableRefObject<HTMLDivElement | null> = { current: null }

      const { rerender, getByTestId } = render(
        <Fixture internalRef={internal.setup} externalRef={oldObjectRef} />,
      )

      const node = getByTestId('target')

      expect(oldObjectRef.current).toBe(node)

      rerender(<Fixture internalRef={internal.setup} externalRef={newObjectRef} />)

      expect(oldObjectRef.current).toBeNull()
      expect(newObjectRef.current).toBe(node)
    })

    test('アンマウント時はすべてのrefがcleanupされる', () => {
      const internal = createInternalRef()
      const externalRef: MutableRefObject<HTMLDivElement | null> = { current: null }

      const { unmount } = render(<Fixture internalRef={internal.setup} externalRef={externalRef} />)

      unmount()

      expect(internal.cleanup).toHaveBeenCalledTimes(1)
      expect(externalRef.current).toBeNull()
    })

    test('refsが差し替わりつつ要素だけが外れた場合もすべてのrefがcleanupされる', () => {
      const internal = createInternalRef()
      const externalRef: MutableRefObject<HTMLDivElement | null> = { current: null }

      const { rerender } = render(
        <Fixture internalRef={internal.setup} externalRef={externalRef} />,
      )

      // 外部refの参照が変わると同時に、コンポーネントは残ったまま要素だけが外れる
      rerender(
        <Fixture internalRef={internal.setup} externalRef={() => undefined} hasElement={false} />,
      )

      expect(internal.cleanup).toHaveBeenCalledTimes(1)
      expect(externalRef.current).toBeNull()
    })

    test('要素が未マウントの間にrefsが差し替わっても、マウント時には最新のrefsが設定される', () => {
      const internal = createInternalRef()
      const unusedRef = vi.fn()
      const latestRef = vi.fn()

      const { rerender, getByTestId } = render(
        <Fixture internalRef={internal.setup} externalRef={unusedRef} hasElement={false} />,
      )

      rerender(<Fixture internalRef={internal.setup} externalRef={latestRef} hasElement={false} />)

      expect(unusedRef).not.toHaveBeenCalled()
      expect(latestRef).not.toHaveBeenCalled()

      rerender(<Fixture internalRef={internal.setup} externalRef={latestRef} />)

      expect(unusedRef).not.toHaveBeenCalled()
      expect(latestRef).toHaveBeenCalledWith(getByTestId('target'))
    })
  })
})
