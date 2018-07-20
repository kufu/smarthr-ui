export const getParentElementByClassName = (
  element: HTMLElement | null,
  className: string = '',
  isRecursive: boolean = false,
): HTMLElement | null => {
  if (!element) return null
  if (element.classList.contains(className)) return element
  if (element === document.body) return null
  if (isRecursive) {
    return getParentElementByClassName(element.parentElement, className, isRecursive)
  }
  return null
}
