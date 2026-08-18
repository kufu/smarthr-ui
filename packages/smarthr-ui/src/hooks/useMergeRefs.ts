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
export const useMergeRefs = <T>(ref1: MergeableRefType<T>, ref2: MergeableRefType<T>) =>
  useCallback(
    (node: T | null) => {
      setRef(ref1, node)
      setRef(ref2, node)
    },
    [ref1, ref2],
  )

const setRef = <T>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ;(ref as MutableRefObject<T | null>).current = value
  }
}
