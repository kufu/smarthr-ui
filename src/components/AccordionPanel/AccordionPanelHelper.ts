export const getShouldExpanded = (expanded: Map<string, string>, name: string) =>
  !!expanded.get(name)

export const mapToArray = (map: Map<string, string>) => Array.from(map.keys())

export const arrayToMap = (array: string[]) => {
  const map = new Map()
  array.forEach(item => map.set(item, item))
  return map
}
