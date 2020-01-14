export const getNewExpandedItems = (
  prevExpandedItems: Map<string, string>,
  itemName: string,
  isExpanded: boolean,
  expandableMultiply: boolean,
) => {
  let newState: Map<string, string>

  if (expandableMultiply) {
    newState = new Map(prevExpandedItems)
    isExpanded ? newState.set(itemName, itemName) : newState.delete(itemName)
  } else {
    newState = isExpanded ? new Map([[itemName, itemName]]) : new Map()
  }

  return newState
}
