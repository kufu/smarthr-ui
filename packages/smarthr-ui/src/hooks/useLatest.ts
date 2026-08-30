import { useMemo } from 'react'

/**
 * 常に最新の値を参照するためのフック。
 * useCallbackやuseMemoの依存配列を減らし、不要な再実行を防ぐために使用する。
 *
 * 返されるオブジェクトのプロパティは読み取り専用で、
 * 常に最新の値を参照する。
 *
 * @example
 * const latest = useLatest({
 *   onChange,
 *   onSelect,
 *   selectedItem,
 * })
 *
 * // 最新の値に常にアクセス可能
 * latest.onChange?.(e)
 * if (latest.selectedItem) { ... }
 */
export function useLatest<T extends object>(values: T): Readonly<T> {
  const stableValues = useMemo(() => ({}), [])

  // TODO: 必要に応じて下記ロジックを導入する。
  // 通常の利用方法では削除する必要性はないためコメントアウトしている
  // // 古いプロパティをすべて削除してから assign する（キーの増減に対応）
  // for (const key in stableValues) {
  //   if (!(key in values)) {
  //     delete (stableValues as any)[key]
  //   }
  // }

  Object.assign(stableValues, values)

  return stableValues as Readonly<T>
}
