import { useCallback } from 'react'

import type { MutableRefObject, Ref } from 'react'

type MergeableRefType<T> = Ref<T> | undefined

/**
 * ref を1つの callback ref にマージするフック。
 * useImperativeHandle を使わずに外部 ref と内部 ref を同時に設定できる。
 *
 * @example
 * const mergedRef = useMergeRefs(externalRef, internalRef)
 * return <input ref={mergedRef} />
 */
// eslint-disable-next-line smarthr/best-practice-for-rest-parameters
export const useMergeRefs = <T>(...refs: Array<MergeableRefType<T>>) =>
  useCallback(
    (node: T | null) => {
      const cleanups = refs.map((ref) => setRef(ref, node))

      return () => {
        refs.forEach((ref, i) => {
          cleanupRef(ref, cleanups[i])
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  )

const setRef = <T>(ref: MergeableRefType<T>, value: T | null) => {
  if (typeof ref === 'function') {
    const result = ref(value)

    return typeof result === 'function' ? result : undefined
  } else if (ref) {
    ;(ref as MutableRefObject<T | null>).current = value
  }

  return undefined
}

const cleanupRef = <T>(ref: MergeableRefType<T>, cleanup: (() => void) | undefined) => {
  if (typeof cleanup === 'function') {
    cleanup()
  } else {
    setRef(ref, null)
  }
}
