import { type DependencyList, useLayoutEffect, useRef, useState } from 'react'

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
export const useLayoutEffectRef = <T extends HTMLElement>(
  action: (node: T | null) => void | (() => void),
  dependencies: DependencyList,
) => {
  const [node, setNode] = useState<T | null>(null)
  const ref = useRef({
    isMount,
    action,
    cleanup,
  })
  actionRef.current.action = action

  useLayoutEffect(
    () => {
      if (node) {
        ref.current.isMount = true
        actionRef.current(node)
      } else if (ref.current.isMount) {
        actionRef.current(node)
        ref.current.isMount = false
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...dependencies, node],
  )

  return setNode
}
