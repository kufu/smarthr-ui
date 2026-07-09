import { useMemo, useRef } from 'react'

/**
 * 常に最新の値を参照するためのフック。
 * useCallbackやuseMemoの依存配列を減らし、不要な再実行を防ぐために使用する。
 *
 * 返されるオブジェクトのプロパティは読み取り専用で、
 * 常に最新の値を参照する。
 *
 * @example
 * const latests = useLatest({
 *   onChange,
 *   onSelect,
 *   selectedItem,
 * })
 *
 * // 最新の値に常にアクセス可能
 * latests.onChange?.(e)
 * if (latests.selectedItem) { ... }
 */
export function useLatest<T extends Record<string, any>>(values: T): Readonly<T> {
  const ref = useRef<T>(values)
  ref.current = values

  const proxy = useMemo(
    () =>
      new Proxy({} as T, {
        get: (_target, prop) => ref.current[prop as keyof T],
      }) as Readonly<T>,
    [],
  )

  return proxy
}
