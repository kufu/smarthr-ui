export const getIsInclude = <K, V>(map: Map<K, V>, key: K) => !!map.get(key)

export const mapToKeyArray = <K, V>(map: Map<K, V>) => Array.from(map.keys())

export const flatArrayToMap = <T>(array: T[]) => new Map(array.map((item): [T, T] => [item, item]))
