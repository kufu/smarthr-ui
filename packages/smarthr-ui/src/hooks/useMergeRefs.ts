import { useCallback } from 'react'

import type { MutableRefObject, Ref } from 'react'

/**
 * 複数の ref を1つの callback ref にマージするフック。
 * useImperativeHandle を使わずに外部 ref と内部 ref を同時に設定できる。
 *
 * @example
 * const mergedRef = useMergeRefs(externalRef, internalRef)
 * return <input ref={mergedRef} />
 */
export const useMergeRefs = <T>(...rest: Array<Ref<T> | undefined>) =>
  useCallback(
    (node: T | null) => {
      // eslint-disable-next-line smarthr/best-practice-for-rest-parameters
      rest.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as MutableRefObject<T | null>).current = node
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    rest,
  )
