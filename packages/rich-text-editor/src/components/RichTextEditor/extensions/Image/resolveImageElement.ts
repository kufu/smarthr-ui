export const resolveImageElement = (dom: Node | null): HTMLImageElement | null => {
  if (dom instanceof HTMLImageElement) return dom
  if (dom instanceof HTMLElement) return dom.querySelector('img')

  return null
}
