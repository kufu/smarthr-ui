export const TABLE_BAR_GAP = 6
export const TABLE_BAR_THICKNESS = 18

export const resolveTableDisplayElement = (table: HTMLElement) =>
  table.parentElement?.classList.contains('tableWrapper') ? table.parentElement : table

export const resolveTableDisplayElementFromDOM = (dom: Node | null): HTMLElement | null => {
  if (!(dom instanceof HTMLElement)) return null

  const table = dom.tagName === 'TABLE' ? dom : dom.querySelector('table')

  return table ? resolveTableDisplayElement(table) : null
}
