import { useCallback, useRef } from 'react'

/**
 * 渡した callback を、初回の呼び出しでのみ実行されるようにラップするフック。
 * 2回目以降の呼び出しは何もしない。
 *
 * callback ref のように複数回呼び出される可能性がある処理を、
 * マウント時に一度だけ実行したい場合などに使う。
 *
 * @example
 * const focusOnce = useOnce((node: HTMLInputElement) => {
 *   node.focus()
 * })
 *
 * const callbackRef = (node: HTMLInputElement | null) => {
 *   if (node) {
 *     focusOnce(node)
 *   }
 * }
 */
export const useOnce = <Args extends unknown[], Return>(callback: (...rest: Args) => Return) => {
  const innerRef = useRef({
    executed: false,
    callback,
  })
  innerRef.current = {
    executed: innerRef.current.executed,
    callback,
  }

  return useCallback((...rest: Args): Return | undefined => {
    if (innerRef.current.executed) {
      return undefined
    }

    innerRef.current.executed = true

    return innerRef.current.callback(...rest)
  }, [])
}
