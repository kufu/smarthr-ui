import { useCallback, useRef } from 'react'

/**
 * callback ref が返す cleanup 関数を、React 18 でも正しく実行されるようにするフック。
 *
 * React 19 では callback ref が返した関数を React がデタッチ時に自動で呼び出すが、
 * React 18 にはその仕組みがなく、返り値は無視されてしまう。
 * このフックは node のアタッチ/デタッチを自前で管理し、返り値の cleanup 関数を
 * デタッチ時（node が null で呼ばれたとき）に確実に実行することで、
 * React 18/19 どちらでも同じ挙動になるようにする。
 *
 * cleanup 関数を返さなかった場合は、React 19 と同様に callback 自体を
 * node = null で呼び直す（useMergeRefs の cleanupRef と同じフォールバック）。
 * そのため callback 側で node が null の場合の処理を書いても問題ない。
 *
 * callback は呼び出し側で useCallback によりメモ化して渡す。
 * callback の参照が変わると返り値の関数の参照も変わる。
 *
 * React 18 のサポートが不要になったら、このフックは削除して
 * callback ref をそのまま渡す形に戻せる。
 *
 * このフックが返す関数はどのパスでも値を返さない（常に undefined）ため、
 * React からは「cleanup 関数を返さない callback ref」として扱われる。
 * そのため React 19 でも自動 cleanup 呼び出しの対象にはならず、
 * デタッチ時は常に React から node = null で呼び直される。
 * これにより React 18/19 のどちらでも同じ呼び出され方になり、
 * cleanup の実行はフック内部の分岐だけで完結する。
 *
 * @example
 * const callbackRef = useCallbackRefCleanupForReact18(
 *   useCallback((node: HTMLDivElement | null) => {
 *     if (!node) return
 *
 *     const observer = new MutationObserver(...)
 *     observer.observe(node, {...})
 *
 *     return () => observer.disconnect()
 *   }, []),
 * )
 */
export const useCallbackRefCleanupForReact18 = <T>(
  callback: (node: T | null) => (() => void) | undefined,
) => {
  const cleanupRef = useRef<(() => void) | undefined>(undefined)

  return useCallback(
    (node: T | null) => {
      if (node) {
        cleanupRef.current = callback(node)
        return
      }

      if (cleanupRef.current) {
        cleanupRef.current()
      } else {
        callback(null)
      }

      cleanupRef.current = undefined
    },
    [callback],
  )
}
