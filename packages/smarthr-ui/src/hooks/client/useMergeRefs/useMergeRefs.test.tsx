import { render, renderHook } from '@testing-library/react'
import { StrictMode } from 'react'

import { useMergeRefs } from './useMergeRefs'

import type { MutableRefObject, Ref } from 'react'

// アンマウント時のcleanupはマイクロタスクまで遅延されるため、待ってから検証する
const flushMicrotasks = () => Promise.resolve().then(() => Promise.resolve())

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

  test('アンマウント時はマウント時と逆順でcleanupされる', async () => {
    const order: string[] = []
    const first = vi.fn(() => {
      order.push('first-set')
      return () => order.push('first-cleanup')
    })
    const second = vi.fn(() => {
      order.push('second-set')
      return () => order.push('second-cleanup')
    })

    const Fixture = () => {
      const mergedRef = useMergeRefs(first, second)

      return <div ref={mergedRef} />
    }

    const { unmount } = render(<Fixture />)

    unmount()
    await flushMicrotasks()

    expect(order).toEqual(['first-set', 'second-set', 'second-cleanup', 'first-cleanup'])
  })

  test('callback refがcleanup関数を返さない場合はアンマウント時にnullで呼び出される', async () => {
    const callbackRef = vi.fn()

    const Fixture = () => {
      const mergedRef = useMergeRefs(callbackRef)

      return <div ref={mergedRef} />
    }

    const { unmount } = render(<Fixture />)

    expect(callbackRef).toHaveBeenNthCalledWith(1, expect.any(HTMLDivElement))

    unmount()
    await flushMicrotasks()

    expect(callbackRef).toHaveBeenNthCalledWith(2, null)
  })

  test('RefObjectはアンマウント時にcurrentがnullにリセットされる', async () => {
    const objectRef: MutableRefObject<HTMLDivElement | null> = { current: null }

    const Fixture = () => {
      const mergedRef = useMergeRefs(objectRef)

      return <div ref={mergedRef} />
    }

    const { unmount } = render(<Fixture />)

    expect(objectRef.current).toBeInstanceOf(HTMLDivElement)

    unmount()
    await flushMicrotasks()

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

    test('参照が変わっていないrefは再実行されない', async () => {
      const internal = createInternalRef()

      const { rerender } = render(
        <Fixture internalRef={internal.setup} externalRef={() => undefined} />,
      )

      expect(internal.setup).toHaveBeenCalledTimes(1)

      // 外部refのみ参照が変わる（利用者がインラインのcallback refを渡した場合と同じ状況）
      rerender(<Fixture internalRef={internal.setup} externalRef={() => undefined} />)
      await flushMicrotasks()

      expect(internal.setup).toHaveBeenCalledTimes(1)
      expect(internal.cleanup).not.toHaveBeenCalled()
    })

    test('参照が変わったrefは旧refのcleanupが先、新refへのnode設定が後', () => {
      const internal = createInternalRef()
      const order: string[] = []
      const oldExternalRef = vi.fn((node: HTMLDivElement | null) => {
        order.push(node ? 'old-set' : 'old-cleanup')
      })
      const newExternalRef = vi.fn((node: HTMLDivElement | null) => {
        order.push(node ? 'new-set' : 'new-cleanup')
      })

      const { rerender, getByTestId } = render(
        <Fixture internalRef={internal.setup} externalRef={oldExternalRef} />,
      )

      const node = getByTestId('target')

      expect(oldExternalRef).toHaveBeenCalledWith(node)
      order.length = 0

      rerender(<Fixture internalRef={internal.setup} externalRef={newExternalRef} />)

      expect(oldExternalRef).toHaveBeenLastCalledWith(null)
      expect(newExternalRef).toHaveBeenCalledWith(node)
      // 同一リソースへの新旧の登録が入れ替わる場合を考慮し、旧refのcleanupを先に済ませてから新refを設定する。
      // React 19 のネイティブ cleanup により、これは host 要素の commit フェーズ内で同期的に完了する
      expect(order).toEqual(['old-cleanup', 'new-set'])
    })

    test('先頭と末尾のrefが同時に差し替わっても、cleanupは元の並びの逆順・設定は先頭から順になる', () => {
      const order: string[] = []
      const makeRef = (name: string) => (node: HTMLDivElement | null) => {
        order.push(node ? `${name}-set` : `${name}-cleanup`)
      }

      const second = makeRef('second')

      const ThreeRefFixture = ({
        first,
        third,
      }: {
        first: Ref<HTMLDivElement>
        third: Ref<HTMLDivElement>
      }) => {
        const mergedRef = useMergeRefs(first, second, third)

        return <div ref={mergedRef} />
      }

      const { rerender } = render(
        <ThreeRefFixture first={makeRef('first')} third={makeRef('third')} />,
      )
      order.length = 0

      // 中央(second)は差し替えず、先頭(first)と末尾(third)だけ参照が変わる
      rerender(<ThreeRefFixture first={makeRef('firstB')} third={makeRef('thirdB')} />)

      expect(order).toEqual(['third-cleanup', 'first-cleanup', 'firstB-set', 'thirdB-set'])
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

    test('アンマウント時はすべてのrefがcleanupされる', async () => {
      const internal = createInternalRef()
      const externalRef: MutableRefObject<HTMLDivElement | null> = { current: null }

      const { unmount } = render(<Fixture internalRef={internal.setup} externalRef={externalRef} />)

      unmount()
      await flushMicrotasks()

      expect(internal.cleanup).toHaveBeenCalledTimes(1)
      expect(externalRef.current).toBeNull()
    })

    test('refsが差し替わりつつ要素だけが外れた場合もすべてのrefがcleanupされる', async () => {
      const internal = createInternalRef()
      const externalRef: MutableRefObject<HTMLDivElement | null> = { current: null }

      const { rerender } = render(
        <Fixture internalRef={internal.setup} externalRef={externalRef} />,
      )

      // 外部refの参照が変わると同時に、コンポーネントは残ったまま要素だけが外れる
      rerender(
        <Fixture internalRef={internal.setup} externalRef={() => undefined} hasElement={false} />,
      )
      await flushMicrotasks()

      expect(internal.cleanup).toHaveBeenCalledTimes(1)
      expect(externalRef.current).toBeNull()
    })

    test('要素が外れたあとに再マウントした場合、最新のrefsが設定される', async () => {
      const internal = createInternalRef()
      const externalRef = vi.fn()

      const { rerender, getByTestId } = render(
        <Fixture internalRef={internal.setup} externalRef={externalRef} />,
      )

      rerender(
        <Fixture internalRef={internal.setup} externalRef={externalRef} hasElement={false} />,
      )
      await flushMicrotasks()

      expect(internal.cleanup).toHaveBeenCalledTimes(1)

      rerender(<Fixture internalRef={internal.setup} externalRef={externalRef} />)

      // 再マウント時は引き継ぐものが無いため、すべてのrefが設定し直される
      expect(internal.setup).toHaveBeenCalledTimes(2)
      expect(externalRef).toHaveBeenLastCalledWith(getByTestId('target'))
    })

    test('StrictModeで同じcallback refが2回呼び出されても、設定が取り消されない', async () => {
      const internal = createInternalRef()
      const externalRef: MutableRefObject<HTMLDivElement | null> = { current: null }

      render(
        <StrictMode>
          <Fixture internalRef={internal.setup} externalRef={externalRef} />
        </StrictMode>,
      )

      await flushMicrotasks()

      // StrictModeではrefのattach/detachが二重に実行されるが、
      // 最終的にはnodeが設定された状態で残っていなければならない
      expect(externalRef.current).toBeInstanceOf(HTMLDivElement)
      expect(internal.setup.mock.calls.length).toBeGreaterThan(0)
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

  describe('実装が前提にしていること（regression guard）', () => {
    // このテストはReactの実際の挙動を検証するものではなく、Reactの内部スケジューリングを
    // 手動でバイパスして「差し替え時のcleanup->setupが同一マイクロタスク内で完結しなくなった場合」
    // を人工的に再現する。実装コメント（useMergeRefs.ts）に記載の将来リスク（<ViewTransition>の
    // stable化でmutation/layoutフェーズ間に非同期の中断が入りうる）が現実になった場合の
    // 影響範囲を示すためのもの。このテストがpassし続けること自体は「今は前提が成立している」
    // ことを意味しない点に注意。前提が崩れると何が起きるかを固定するためのテスト
    test('cleanupとsetupの間にマイクロタスクが挟まると、参照が変わっていないrefまで誤って再実行される', async () => {
      const internalCleanup = vi.fn()
      const internal = vi.fn(() => internalCleanup)
      const oldExternal = vi.fn()
      const newExternal = vi.fn()

      const { result, rerender } = renderHook(
        ({ ext }: { ext: typeof oldExternal }) => useMergeRefs(internal, ext),
        { initialProps: { ext: oldExternal } },
      )

      const node = {} as HTMLDivElement
      // 現実のReactでの「setup A」に相当
      const cleanupA = result.current(node)

      expect(internal).toHaveBeenCalledTimes(1)

      // refsが変わる（rerenderで新しいcallback関数を生成させる）。
      // 現実のReactでは、この直後に同期的に「cleanupA -> setupB」が呼ばれる
      rerender({ ext: newExternal })

      const setupB = result.current

      // 現実のReact: cleanupA() の直後、同期的にsetupB(node) が呼ばれる。
      // ここでは「Reactの将来の実装変化」を想定し、間にマイクロタスクを1つ挟んでみる
      cleanupA?.()

      await Promise.resolve()

      // この時点で、setupBはまだ呼ばれていないのに、internalが誤ってcleanupされていないか
      const cleanupCalledBeforeNewSetup = internalCleanup.mock.calls.length > 0

      setupB(node)

      // 実装が前提にしている「同一マイクロタスク内」が崩れると、
      // 参照が変わっていないinternalまで誤って再実行されてしまう
      expect(cleanupCalledBeforeNewSetup).toBe(true)
      expect(internal).toHaveBeenCalledTimes(2)
    })
  })
})
