export function hasParentElementByClassName(
  element: HTMLElement | SVGElement | null,
  className: string,
): boolean {
  if (!element) return false
  return (
    element.classList.contains(className) ||
    hasParentElementByClassName(element.parentElement, className)
  )
}
