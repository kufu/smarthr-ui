export type RelativeRect = { top: number; left: number; width: number; height: number }

export const isSameRect = (a: RelativeRect, b: RelativeRect) =>
  a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height

export const getControlOrigin = (container: HTMLElement) => {
  const bounds = container.getBoundingClientRect()
  return { left: bounds.left + container.clientLeft, top: bounds.top + container.clientTop }
}

export const getRelativeRect = (
  rect: DOMRect,
  origin: { left: number; top: number },
): RelativeRect => ({
  left: rect.left - origin.left,
  top: rect.top - origin.top,
  width: rect.width,
  height: rect.height,
})
