const candidateSelector = [
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
].join(',')

type Option = {
  shouldIgnoreVisibility?: boolean
}

export function tabbable(el: HTMLElement, option?: Option) {
  const candidates = Array.from(el.querySelectorAll<HTMLElement>(candidateSelector)).filter(
    (element) => element.tabIndex >= 0,
  )

  if (option?.shouldIgnoreVisibility) {
    return candidates
  }

  return candidates.filter(isVisible)
}

function isVisible(node: Element) {
  return getComputedStyle(node).visibility !== 'hidden' && !isDisplayNone(node)
}

function isDisplayNone(node: Element): boolean {
  if (getComputedStyle(node).display === 'none') return true

  return isDisplayNone(node.parentElement)
}
