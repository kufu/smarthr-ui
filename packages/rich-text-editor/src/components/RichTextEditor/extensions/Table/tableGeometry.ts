export const TABLE_BAR_GAP = 6
export const TABLE_BAR_THICKNESS = 18

export const getTableControlOrigin = (container: HTMLElement) => {
  const bounds = container.getBoundingClientRect()
  return { left: bounds.left + container.clientLeft, top: bounds.top + container.clientTop }
}

export const getRelativeRect = (rect: DOMRect, origin: { left: number; top: number }) => ({
  left: rect.left - origin.left,
  top: rect.top - origin.top,
  width: rect.width,
  height: rect.height,
})

export const resolveTableDisplayElement = (table: HTMLElement) =>
  table.parentElement?.classList.contains('tableWrapper') ? table.parentElement : table
