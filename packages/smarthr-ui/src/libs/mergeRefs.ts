import { MutableRefObject, Ref, RefCallback, RefObject } from 'react'

const isMutableRefObject = <T = unknown>(ref: RefObject<T>): ref is MutableRefObject<T> =>
  ref !== null && ref !== undefined

export const mergeRefs =
  <T = unknown>(...refs: Array<Ref<T> | undefined>): RefCallback<T> =>
  (node: T) => {
    for (const ref of refs) {
      if (!ref) {
        continue
      }
      if (typeof ref === 'function') {
        ref(node)
        continue
      }
      if (isMutableRefObject(ref)) {
        ref.current = node
        continue
      }
    }
  }
