import { type DependencyList, useCallback, useLayoutEffect, useRef } from 'react'

type CleanupType = void | (() => void)

const NOOP = () => {}

/**
 * useRef + useLayoutEffectで、見た目上はcallback refのように振る舞うrefを作るフック。
 * 戻り値(callback ref)自体の参照は常に安定しているため、useMergeRefsに渡しても
 * dependenciesの変化で他のrefまで巻き込まれて再アタッチされることがない。
 *
 * 通常のcallback refと同様、nodeがアタッチ/デタッチされた際にactionを実行する。
 * それに加えてdependenciesが変化した際にも(nodeを変えずに)actionを再実行する。
 *
 * @example
 * const layoutEffectRef = useLayoutEffectRef((node) => {
 *   if (!node) return
 *   // ...
 *   return () => { ... } // cleanup(任意)
 * }, [dep])
 * const mergedRef = useMergeRefs(layoutEffectRef, otherRef)
 */
export const useLayoutEffectRef = <T extends HTMLElement>(
  action: (node: T | null) => CleanupType,
  dependencies: DependencyList,
) => {
  const state = useRef<{
    isFirstEffect: boolean
    node: T | null
    cleanup: CleanupType
    action: (node: T | null) => CleanupType
    runAction: () => void
  }>({
    // HINT: マウント時はcallback ref側で既にrunActionを実行しているため、
    // useLayoutEffectの初回実行はスキップし、dependencies変化時のみ再実行する
    isFirstEffect: true,
    node: null,
    cleanup: undefined,
    action,
    runAction: NOOP,
  })
  state.current.action = action
  state.current.runAction = () => {
    if (typeof state.current.cleanup === 'function') {
      state.current.cleanup()
    }
    state.current.cleanup = state.current.action(state.current.node)
  }

  useLayoutEffect(
    () => {
      // HINT: nodeがまだcallback ref経由でアタッチされていない場合、実行しない
      if (!state.current.node) {
        return
      }

      if (state.current.isFirstEffect) {
        state.current.isFirstEffect = false
        return
      }

      state.current.runAction()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies,
  )

  return useCallback((node: T | null) => {
    state.current.node = node
    state.current.runAction()
  }, [])
}
