const candidateSelectors = [
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  'button:not([disabled])',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  'details>summary',
]
const candidateSelector = candidateSelectors.join(',')

type Option = {
  shouldIgnoreVisibility: boolean
}
const defaultOption: Option = {
  shouldIgnoreVisibility: false,
}

export function tabbable(el: HTMLElement, option?: Partial<Option>) {
  const mergedOption = {
    ...defaultOption,
    ...option,
  }
  const candidates = Array.from(el.querySelectorAll<HTMLElement>(candidateSelector)).filter(
    (element) => element.tabIndex >= 0,
  )
  if (mergedOption.shouldIgnoreVisibility) {
    return candidates
  }
  return candidates.filter((candidate) => !isHidden(candidate))
}

function isHidden(node: Element) {
  if (getComputedStyle(node).visibility === 'hidden') return true
  if (isDisplayNone(node)) return true

  return false
}

function isDisplayNone(node: Element | null): boolean {
  if (!node) {
    return false
  }
  if (getComputedStyle(node).display === 'none') return true
  return isDisplayNone(node.parentElement)
}
