export const getIsInclude = <K, V>(map: Map<K, V>, key: K) => !!map.get(key)

export const mapToArray = <K, V>(map: Map<K, V>) => Array.from(map.keys())

export const arrayToMap = <T>(array: T[]) => {
  const map = new Map<T, T>()
  array.forEach(item => map.set(item, item))
  return map
}
