export const SWATCHES_PER_ROW = 5

// 見た目の行を座標から求める方式は採らない。開いた直後や jsdom では座標が揃わないため
const toRows = (swatches: HTMLElement[]) =>
  swatches.reduce<HTMLElement[][]>((rows, swatch) => {
    const last = rows.at(-1)

    if (last && last[0].parentElement === swatch.parentElement && last.length < SWATCHES_PER_ROW) {
      last.push(swatch)
    } else {
      rows.push([swatch])
    }

    return rows
  }, [])

export const isPlainArrowKey = (e: {
  key: string
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
}) => e.key.startsWith('Arrow') && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey

export const findSwatchFocusTarget = (
  swatches: HTMLElement[],
  current: HTMLElement,
  key: string,
): HTMLElement | undefined => {
  const index = swatches.indexOf(current)

  if (index === -1) return undefined

  switch (key) {
    case 'ArrowRight':
      return swatches[index + 1]
    case 'ArrowLeft':
      return swatches[index - 1]
    case 'ArrowDown':
    case 'ArrowUp': {
      const rows = toRows(swatches)
      const rowIndex = rows.findIndex((row) => row.includes(current))
      const row = rows[rowIndex + (key === 'ArrowDown' ? 1 : -1)]

      return row?.[Math.min(rows[rowIndex].indexOf(current), row.length - 1)]
    }
    default:
      return undefined
  }
}
