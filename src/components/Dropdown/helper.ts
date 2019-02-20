export function getRandomStr() {
  const str = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const strLen = str.length
  let result = ''

  for (let i = 0; i < 8; i++) {
    result += str[Math.floor(Math.random() * strLen)]
  }

  return result
}

export function getParentElementRecursively(
  element: HTMLElement | null,
  className: string = '',
): HTMLElement | null {
  if (!element) return null
  if (element.classList.contains(className)) return element
  if (element === document.body) return null
  return getParentElementRecursively(element.parentElement, className)
}
