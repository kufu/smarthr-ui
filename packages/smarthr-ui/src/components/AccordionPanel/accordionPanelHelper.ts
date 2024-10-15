export const getNewExpandedItems = (
  prevExpandedItems: Map<string, string>,
  itemName: string,
  isExpanded: boolean,
  expandableMultiply: boolean,
) => {
  let newState: Map<string, string>

  if (expandableMultiply) {
    newState = new Map(prevExpandedItems)

    if (isExpanded) {
      newState.set(itemName, itemName)
    } else {
      newState.delete(itemName)
    }
  } else {
    newState = isExpanded ? new Map([[itemName, itemName]]) : new Map()
  }

  return newState
}

export const keycodes = {
  SPACE: 32,
  ENTER: 13,
  HOME: 36,
  END: 35,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  LEFT: 37,
}

export const getSiblingButtons = (parent: HTMLDivElement): HTMLElement[] =>
  Array.from(parent.querySelectorAll('[data-component="AccordionHeaderButton"]'))

export const focusFirstSibling = (parent: HTMLDivElement): void => {
  const siblings = getSiblingButtons(parent)
  const first = siblings[0]
  first.focus()
}

export const focusLastSibling = (parent: HTMLDivElement): void => {
  const siblings = getSiblingButtons(parent)
  const last = siblings[siblings.length - 1]
  last.focus()
}

export const focusNextSibling = (item: HTMLElement, parent: HTMLDivElement): void => {
  const siblings = getSiblingButtons(parent)
  const current = siblings.indexOf(item)

  if (current === siblings.length - 1) {
    const first = siblings[0]
    first.focus()
  } else if (current !== -1) {
    const next = siblings[current + 1]
    next.focus()
  }
}

export const focusPreviousSibling = (item: HTMLElement, parent: HTMLDivElement): void => {
  const siblings = getSiblingButtons(parent)
  const current = siblings.indexOf(item)

  if (current === 0) {
    const last = siblings[siblings.length - 1]
    last.focus()
  } else if (current !== -1) {
    const previous = siblings[current - 1]
    previous.focus()
  }
}
