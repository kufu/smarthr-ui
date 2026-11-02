type PlainObject = Record<string, unknown>

const isPlainObject = (value: unknown): value is PlainObject => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const proto = Object.getPrototypeOf(value)

  return proto === Object.prototype || proto === null
}

/**
 * targetにsourceを再帰的にマージした新しいオブジェクトを返す。targetとsourceは変更しない
 *
 * - sourceの値を優先する
 * - 値がundefinedのプロパティと、null・undefinedのsourceは無視する
 * - プレーンオブジェクト同士は再帰的にマージし、それ以外の値(配列を含む)は上書きする
 */
export const merge = <T extends object>(target: T, source: object | null | undefined): T => {
  const result = { ...target } as PlainObject

  Object.entries(source ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      const current = result[key]

      result[key] = isPlainObject(value)
        ? merge(isPlainObject(current) ? current : {}, value)
        : value
    }
  })

  return result as T
}
