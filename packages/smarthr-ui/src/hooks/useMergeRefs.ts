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
        // mountとは逆順でcleanupする。後方のrefが前方のrefのcurrentに依存していても、
        // その依存先がcleanupで先に消されないようにするため
        for (let i = refs.length - 1; i >= 0; i--) {
          cleanupRef(refs[i], cleanups[i])
        }
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
}

const cleanupRef = <T>(ref: MergeableRefType<T>, cleanup: (() => void) | undefined) => {
  if (cleanup) {
    cleanup()
  } else {
    setRef(ref, null)
  }
}
