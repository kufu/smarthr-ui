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
 * - `__proto__` などのキーもプロトタイプを変更せず、通常のプロパティとして扱う
 */
export const merge = <T extends object>(target: T, source: object | null | undefined): T => {
  const result = { ...target } as PlainObject

  Object.entries(source ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      // HINT: `__proto__` や `constructor` で継承したプロパティを拾わないよう、自身のプロパティのみ参照する
      const current = Object.prototype.hasOwnProperty.call(result, key) ? result[key] : undefined

      // HINT: 代入だと `__proto__` キーでプロトタイプが書き換わるため、definePropertyで定義する
      Object.defineProperty(result, key, {
        value: isPlainObject(value) ? merge(isPlainObject(current) ? current : {}, value) : value,
        writable: true,
        enumerable: true,
        configurable: true,
      })
    }
  })

  return result as T
}
