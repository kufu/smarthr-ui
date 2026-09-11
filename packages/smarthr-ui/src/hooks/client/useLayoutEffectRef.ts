import { type DependencyList, useLayoutEffect, useRef, useState } from 'react'

type CleanupType = void | (() => void)

/**
 * useState + useLayoutEffectで、見た目上はcallback refのように振る舞うrefを作るフック。
 * 戻り値(useStateのsetter)自体の参照は常に安定しているため、useMergeRefsに渡しても
 * dependenciesの変化で他のrefまで巻き込まれて再アタッチされることがない。
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
  action: (node: T | null) => void | (() => void),
  dependencies: DependencyList,
) => {
  const [node, setNode] = useState<T | null>(null)
  const ref = useRef<{
    isMount: boolean
    action: (node: T | null) => CleanupType
  }>({
    isMount: false,
    action,
  })
  ref.current.action = action

  useLayoutEffect(
    () => {
      if (node) {
        ref.current.isMount = true
        return ref.current.action(node)
      } else if (ref.current.isMount) {
        ref.current.isMount = false
        return ref.current.action(node)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...dependencies, node],
  )

  return setNode
}
