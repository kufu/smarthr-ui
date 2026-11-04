import { type DependencyList, useCallback, useLayoutEffect, useRef } from 'react'

type CleanupType = void | (() => void)

const NOOP = () => {}

// HINT: useLayoutEffectの依存配列比較と同じロジック(Object.isによるシャロー比較)。
// undefinedはまだ一度もrunActionが実行されていないことを表すため、その場合は不一致(変化あり)として扱う
const areDepsEqual = (committed: DependencyList | undefined, next: DependencyList): boolean =>
  committed !== undefined &&
  committed.length === next.length &&
  committed.every((dep, i) => Object.is(dep, next[i]))

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
    node: T | null
    cleanup: CleanupType
    action: (node: T | null) => CleanupType
    // HINT: 直近でrunActionを実行した時点のdependencies。
    // 「初回かどうか」ではなく「前回実行時から実際にdependenciesが変化したか」を判定するために使う。
    // callback ref経由のrunAction(mount/差し替え時)と、useLayoutEffect経由のrunAction(dependencies変化時)の
    // どちらが先に実行されるかはReactの内部実装依存で保証されない
    // (通常のmountはref attachが先だが、条件付きレンダーで後から要素が追加されるケースはuseLayoutEffectが先に実行される)
    // ため、実行順序に依存せず判定できるようにしている
    committedDeps: DependencyList | undefined
    runAction: () => void
  }>({
    node: null,
    cleanup: undefined,
    action,
    committedDeps: undefined,
    runAction: NOOP,
  })
  state.current.action = action
  state.current.runAction = () => {
    if (typeof state.current.cleanup === 'function') {
      state.current.cleanup()
    }
    state.current.cleanup = state.current.action(state.current.node)
    state.current.committedDeps = dependencies
  }

  useLayoutEffect(
    () => {
      // HINT: nodeがcallback ref経由でアタッチ済み、かつref attach側でまだこのdependenciesで
      // runAction済みでない場合のみ実行する
      if (state.current.node && !areDepsEqual(state.current.committedDeps, dependencies)) {
        state.current.runAction()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies,
  )

  return useCallback((node: T | null) => {
    state.current.node = node
    state.current.runAction()
  }, [])
}
