export const getShouldExpanded = (map: Map<string, string>, key: string) => !!map.get(key)

export const mapToArray = (map: Map<string, string>) => Array.from(map.keys())

export const arrayToMap = (array: string[]) => {
  const map = new Map()
  array.forEach(item => map.set(item, item))
  return map
}
