import { useCallback, useRef } from 'react'

import { useEnhancedEffect } from '../useEnhancedEffect'

import type { MutableRefObject, Ref } from 'react'

type MergeableRefType<T> = Ref<T> | undefined

type AppliedRef<T> = {
  ref: MergeableRefType<T>
  cleanup: (() => void) | undefined
}

/**
 * ref を1つの callback ref にマージするフック。
 * useImperativeHandle を使わずに外部 ref と内部 ref を同時に設定できる。
 *
 * React 18 では callback ref の返り値（cleanup 関数）が無視され、
 * detach 時には callback 自体が node = null で呼び直されるだけになる。
 * そのため cleanup 関数を返り値として React に渡すのではなく、
 * 自前で保持しておき、node = null で呼ばれたときに手動で実行する。
 * これにより React 18/19 のどちらでも同じ挙動になる。
 *
 * 返す callback ref の参照は常に安定している。refs のいずれかが差し替わっても
 * React による detach/attach は発生せず、差し替わった ref だけを設定し直す。
 * 参照が変わっていない ref（内部の callback ref など）は再実行されないため、
 * 利用者がインラインの callback ref を渡していても内部の副作用は作り直されない。
 *
 * refs が差し替わったときの反映は、host 要素の commit 時点ではなく
 * このフックを呼ぶコンポーネントの layout effect の順序内で行われる。
 * 同一コミット内・paint 前ではあるが、useMergeRefs より前に宣言された layout effect と、
 * mergedRef を props で受け取る子コンポーネントの layout effect は反映前に実行される。
 * 参照が変わらない ref のタイミングはマウント時から変化しないため、
 * 影響を受けるのは差し替わった ref のみ。マウント・アンマウントのタイミングは変わらない。
 *
 * @example
 * const mergedRef = useMergeRefs(externalRef, internalRef)
 * return <input ref={mergedRef} />
 */
// eslint-disable-next-line smarthr/best-practice-for-rest-parameters
export const useMergeRefs = <T>(...refs: Array<MergeableRefType<T>>) => {
  const state = useRef<{
    node: T | null
    applied: Array<AppliedRef<T>>
    refs: Array<MergeableRefType<T>>
  }>({ node: null, applied: [], refs })

  // callback ref の参照を安定させるため、最新の refs は state 経由で参照する
  state.current.refs = refs

  const callbackRef = useCallback((node: T | null) => {
    const current = state.current

    current.node = node

    if (node) {
      current.applied = current.refs.map((ref) => ({ ref, cleanup: setRef(ref, node) }))

      return
    }

    cleanupAppliedRefs(current.applied)
    current.applied = []
  }, [])

  // HINT: callback ref の参照を安定させた結果、refs が差し替わっても React は callback ref を
  // 呼び直さない。そのため差し替えの反映（= Reactの外にあるrefとの同期）はここで行う
  useEnhancedEffect(() => {
    const current = state.current
    const { node } = current

    // 要素が未マウントの場合は反映するものがない。
    // マウント時に callback ref が最新の refs を設定するため、ここでは何もしなくてよい
    if (node) {
      cleanupAppliedRefs(current.applied.filter(({ ref }) => !refs.includes(ref)))

      // 参照が変わっていない ref は設定済みの cleanup ごと引き継ぎ、再実行しない
      current.applied = refs.map(
        (ref) =>
          current.applied.find((applied) => applied.ref === ref) ?? {
            ref,
            cleanup: setRef(ref, node),
          },
      )
    }
  }, refs)

  return callbackRef
}

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

const cleanupAppliedRefs = <T>(applied: Array<AppliedRef<T>>) => {
  // 設定時とは逆順でcleanupする。後方のrefが前方のrefのcurrentに依存していても、
  // その依存先がcleanupで先に消されないようにするため
  for (let i = applied.length - 1; i >= 0; i--) {
    cleanupRef(applied[i].ref, applied[i].cleanup)
  }
}
