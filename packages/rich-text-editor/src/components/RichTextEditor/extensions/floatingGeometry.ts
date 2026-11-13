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

// DOMRect にしないのは、view.coordsAtPos の戻り値をそのまま渡せるようにするため
export type AnchorRect = { top: number; bottom: number; left: number; right: number }

export type FloatingPlacement = { top: number; left: number; maxHeight?: number }

const GAP = 2
export const VIEWPORT_PADDING = 10

/** 右隣を優先し、入らなければ左隣。どちらも入らなければ null */
const resolveBesideLeft = (anchor: AnchorRect, contentWidth: number, viewportWidth: number) => {
  const right = anchor.right + GAP

  if (right + contentWidth <= viewportWidth - VIEWPORT_PADDING) return right

  const left = anchor.left - GAP - contentWidth

  return left >= VIEWPORT_PADDING ? left : null
}

export const computeFloatingPlacement = ({
  anchor,
  contentWidth,
  contentHeight,
  viewport,
  scroll,
  beside = false,
}: {
  anchor: AnchorRect
  contentWidth: number
  contentHeight: number
  viewport: { width: number; height: number }
  scroll: { x: number; y: number }
  beside?: boolean
}): FloatingPlacement => {
  const spaceBelow = viewport.height - anchor.bottom - GAP
  const besideLeft = beside ? resolveBesideLeft(anchor, contentWidth, viewport.width) : null
  const left =
    besideLeft ??
    (anchor.left + contentWidth > viewport.width - VIEWPORT_PADDING
      ? Math.max(VIEWPORT_PADDING, viewport.width - contentWidth - VIEWPORT_PADDING)
      : anchor.left)
  const below = anchor.bottom + GAP + scroll.y

  if (contentHeight <= spaceBelow) return { top: below, left: left + scroll.x }

  const spaceAbove = anchor.top - GAP
  if (contentHeight <= spaceAbove) {
    return { top: anchor.top - contentHeight - GAP + scroll.y, left: left + scroll.x }
  }

  if (spaceBelow >= spaceAbove) {
    return { top: below, left: left + scroll.x, maxHeight: spaceBelow - VIEWPORT_PADDING }
  }

  return {
    top: VIEWPORT_PADDING + scroll.y,
    left: left + scroll.x,
    maxHeight: spaceAbove - VIEWPORT_PADDING,
  }
}

/** 上限を付けたまま測ると縮んだ高さが返り、上限の付け外しを繰り返すため、外して測る */
export const measureFloatingHeight = (contentEl: HTMLElement) => {
  const scrollables = [contentEl, contentEl.firstElementChild].filter((el): el is Element =>
    Boolean(el),
  )
  const scrollTops = scrollables.map((el) => el.scrollTop)
  const { maxHeight, display } = contentEl.style
  contentEl.style.maxHeight = ''
  contentEl.style.display = ''
  const height = Math.max(contentEl.offsetHeight, contentEl.scrollHeight)
  contentEl.style.maxHeight = maxHeight
  contentEl.style.display = display
  scrollables.forEach((el, i) => {
    el.scrollTop = scrollTops[i]
  })

  return height
}
