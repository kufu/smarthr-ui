/**
 * 関数の呼び出しを指定された待機時間 (wait) だけ遅延させるデバウンス関数。
 * 直前に同じ関数が呼び出された場合、タイマーをリセットして再び遅延させます。
 *
 * @param {T} func - 実行する関数
 * @param {number} wait - デバウンスの待機時間（ミリ秒）
 * @returns {(...rest: Parameters<T>) => void} デバウンスされた関数
 *
 * @example
 * const debouncedFunction = debounce(() => console.log('Called!'), 200);
 */
export const debounce = <T extends (...rest: any[]) => void>(
  func: T,
  wait: number,
): ((...rest: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (...timeoutRest: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...timeoutRest)
    }, wait)
  }
}
