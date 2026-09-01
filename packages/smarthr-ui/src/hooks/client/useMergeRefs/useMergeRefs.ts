import { useCallback, useRef } from 'react'

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
 * refs のいずれかが差し替わると新しい callback ref を生成する。React 19 は
 * callback ref が返した cleanup 関数をデタッチ時に呼ぶため、差し替え時は
 * 「旧 callback の cleanup → 新 callback の setup」が host 要素の commit
 * フェーズ内で同期的に実行される。この setup の中で差分を判定し、参照が
 * 変わっていない ref（内部の callback ref など）は cleanup ごと引き継いで
 * 再実行しない。そのため利用者がインラインの callback ref を渡していても、
 * 内部の副作用は作り直されない。
 *
 * 【cleanup がマイクロタスクまで遅延される理由】
 * callback ref の cleanup は「差し替えによるデタッチ」でも「アンマウント」でも
 * 同じように呼ばれ、その時点では両者を区別できない。差し替えなら直後に新しい
 * setup が同期的に走るため、cleanup の判断をマイクロタスクまで遅らせ、
 * setup が来たかどうかで判定している。
 *
 * この結果、アンマウント時の cleanup 実行は1マイクロタスク分遅延する。
 * DOM から要素が外れた後の処理であるため実害は無いが、アンマウント直後に
 * 同期的に ref の値を参照する場合は、まだ古い値が残っている点に注意。
 *
 * @example
 * const mergedRef = useMergeRefs(externalRef, internalRef)
 * return <input ref={mergedRef} />
 */
// eslint-disable-next-line smarthr/best-practice-for-rest-parameters
export const useMergeRefs = <T>(...refs: Array<MergeableRefType<T>>) => {
  const state = useRef<{
    applied: Array<AppliedRef<T>>
    // setup が実行されるたびに加算する。cleanup 側は自分の世代と比較することで
    // 「自分より後に setup が実行されたか」を判定する
    generation: number
  }>({ applied: [], generation: 0 })

  return useCallback(
    (node: T | null) => {
      // React 19 は cleanup 関数を返した callback ref を node = null で呼び直さないため、
      // このガードに到達するのは cleanup 関数を返す前（未マウント）のみ
      if (!node) {
        return undefined
      }

      const current = state.current
      const remaining = current.applied.slice()
      const newRefIndexes: number[] = []

      current.applied = refs.map((ref, i) => {
        const index = remaining.findIndex((applied) => applied.ref === ref)

        // 参照が変わっていない ref は設定済みの cleanup ごと引き継ぎ、再実行しない
        if (index !== -1) {
          return remaining.splice(index, 1)[0]
        }

        newRefIndexes.push(i)

        return { ref, cleanup: undefined }
      })

      // 消えるrefを先にcleanupしてから、新しいrefにnodeを設定する。
      // 同一リソースへの新旧の登録が入れ替わる場合でも、事故が起きないようにするため
      cleanupAppliedRefs(remaining)

      for (const i of newRefIndexes) {
        current.applied[i].cleanup = setRef(current.applied[i].ref, node)
      }

      current.generation += 1

      const generation = current.generation

      return () => {
        queueMicrotask(() => {
          // 自分より後に setup が実行されていれば、差し替えによるデタッチであり、
          // 引き継ぎ・cleanup は setup 側で完了している
          if (current.generation === generation) {
            cleanupAppliedRefs(current.applied)
            current.applied = []
          }
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  )
}

const setRef = <T>(ref: MergeableRefType<T>, value: T | null) => {
  if (typeof ref === 'function') {
    const result = ref(value)

    return typeof result === 'function' ? result : undefined
  } else if (ref) {
    ;(ref as MutableRefObject<T | null>).current = value
  }
}

const cleanupAppliedRefs = <T>(applied: Array<AppliedRef<T>>) => {
  // 設定時とは逆順でcleanupする。後方のrefが前方のrefのcurrentに依存していても、
  // その依存先がcleanupで先に消されないようにするため
  for (let i = applied.length - 1; i >= 0; i--) {
    const cleanup = applied[i].cleanup

    if (cleanup) {
      cleanup()
    } else {
      setRef(applied[i].ref, null)
    }
  }
}
