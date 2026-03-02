type FromEntries<T extends Array<readonly [PropertyKey, unknown]>> = {
  [K in T[number][0]]: Extract<T[number], [K, unknown]>[1]
}

export const fromEntries = Object.fromEntries as <T extends Array<readonly [PropertyKey, unknown]>>(
  entries: T,
) => FromEntries<T>

export const entries = Object.entries as <const T extends Record<string, unknown>>(
  obj: T,
) => Array<readonly [keyof T, T[keyof T]]>
