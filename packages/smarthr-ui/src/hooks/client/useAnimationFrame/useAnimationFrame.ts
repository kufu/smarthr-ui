import { useMemo, useRef } from 'react'

/**
 * requestAnimationFrameを実行するためのフック。
 * requestを呼ぶたびに前回予約したフレームを自動でcancelしてから新しいフレームを予約する。
 *
 * cancelは任意のタイミングで呼び出せるため、アンマウント時のクリーンアップなどに使用する。
 *
 * @example
 * const frame = useAnimationFrame()
 *
 * frame.request(() => {
 *   // 実行したい処理
 * })
 *
 * useEffect(() => frame.cancel, [frame.cancel])
 */
export function useAnimationFrame() {
  const cancelIdRef = useRef<number | null>(null)

  return useMemo(() => {
    const cancel = () => {
      if (cancelIdRef.current !== null) {
        cancelAnimationFrame(cancelIdRef.current)
        cancelIdRef.current = null
      }
    }
    return {
      request: (callback: () => void) => {
        cancel()
        cancelIdRef.current = requestAnimationFrame(callback)
      },
      cancel,
    }
  }, [])
}
