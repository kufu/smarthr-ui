export function hasParentElementByClassName(
  element: HTMLElement | null,
  className: string,
): boolean {
  if (!element) return false
  // IE11 において classList は部分的サポートなので class から取得する
  const elementClassNames = (element.getAttribute('class') || '').split(' ')
  return (
    elementClassNames.includes(className) ||
    hasParentElementByClassName(element.parentElement, className)
  )
}
