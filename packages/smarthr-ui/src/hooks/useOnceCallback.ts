import { useCallback, useRef } from 'react'

import { useLatest } from './useLatest'

/**
 * 渡した callback を、初回の呼び出しでのみ実行されるようにラップするフック。
 * 2回目以降の呼び出しは何もしない。
 *
 * callback ref のように複数回呼び出される可能性がある処理を、
 * マウント時に一度だけ実行したい場合などに使う。
 *
 * @example
 * const focusOnce = useOnceCallback((node: HTMLInputElement) => {
 *   node.focus()
 * })
 *
 * const callbackRef = (node: HTMLInputElement | null) => {
 *   if (node) {
 *     focusOnce(node)
 *   }
 * }
 */
export const useOnceCallback = <Args extends unknown[], Return>(
  callback: (...rest: Args) => Return,
) => {
  const executed = useRef(false)
  const latest = useLatest({ callback })

  return useCallback(
    (...rest: Args): Return | undefined => {
      if (executed.current) {
        return undefined
      }

      executed.current = true

      return latest.callback(...rest)
    },
    [latest],
  )
}
