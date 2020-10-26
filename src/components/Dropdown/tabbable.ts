const candidateSelectors = [
  'input',
  'select',
  'textarea',
  'a[href]',
  'button',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  'details>summary',
]
const candidateSelector = candidateSelectors.join(',')

export function tabbable(el: HTMLElement) {
  const candidates = Array.from(el.querySelectorAll<HTMLElement>(candidateSelector))
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
