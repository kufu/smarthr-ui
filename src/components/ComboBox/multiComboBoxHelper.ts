export function hasParentElementByClassName(
  element: HTMLElement | SVGElement | null,
  className: string,
): boolean {
  if (!element) return false
  // IE11 において classList は部分的サポートなので class から取得する
  const elementClassNames = (element.getAttribute('class') || '').split(' ')
  return (
    elementClassNames.includes(className) ||
    hasParentElementByClassName(getParent(element), className)
  )
}

function getParent(element: Element): HTMLElement | SVGElement | null {
  if (element.parentElement) {
    return element.parentElement
  }
  // IE11 では SVG の parentElement が定義されていないため parentNode を参照する
  const node = element.parentNode
  if (node instanceof HTMLElement || node instanceof SVGElement) {
    return node
  }
  return null
}
