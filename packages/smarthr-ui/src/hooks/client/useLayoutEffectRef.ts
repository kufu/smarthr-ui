import { type DependencyList, useLayoutEffect, useRef } from 'react'

/**
 * useRef + useLayoutEffectで、見た目上はcallback refのように振る舞うrefを作るフック。
 * 戻り値(RefObject)自体の参照は常に安定しているため、useMergeRefsに渡しても
 * dependenciesの変化で他のrefまで巻き込まれて再アタッチされることがない。
 *
 * @example
 * const myRef = useLayoutEffectRef((node) => {
 *   if (!node) return
 *   // ...
 *   return () => { ... } // cleanup(任意)
 * }, [dep])
 * const mergedRef = useMergeRefs(myRef, otherRef)
 */
export const useLayoutEffectRef = <T>(
  action: (node: T | null) => void | (() => void),
  dependencies: DependencyList,
) => {
  const ref = useRef<T | null>(null)
  const actionRef = useRef(action)
  actionRef.current = action

  useLayoutEffect(
    () => actionRef.current(ref.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies,
  )

  return ref
}
