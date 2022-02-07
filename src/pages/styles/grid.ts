import { smarthrUITheme } from './theme'
import { defaultHtmlFontSize } from '../../themes/createFontSize'

export type columnCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto'
export type dialogSize = 'S' | 'M' | 'L' | 'XL' | 'X2L' | 'MAX'

const baseColumnCount = 8
const baseColumnWidth = `${defaultHtmlFontSize * baseColumnCount}px`
const factor = 1 / baseColumnCount

const percentageWidth = {
  1: factor * 1,
  2: factor * 2,
  3: factor * 3,
  4: factor * 4,
  5: factor * 5,
  6: factor * 6,
  7: factor * 7,
  8: factor * 8,
}

export const generateWidth = (space: typeof smarthrUITheme.spacingByChar) => {
  const gutter = space(2)
  const column = (span: columnCount, toNumber = false) => {
    if (span === 'auto') {
      return 'auto'
    }

    if (toNumber) {
      return percentageWidth[span] * 100
    }

    return `calc(${baseColumnWidth} * ${span} + ${gutter} * ${span - 1})`
  }

  return {
    column,
    CONTENT: {
      MAIN: column(8),
    },
    DIALOG: {
      S: column(3),
      M: column(4),
      L: column(5),
      XL: column(6),
      X2L: column(7),
      // 左右 gutter 分空ける
      MAX: `calc(100vw - ${gutter} * 2)`,
    },
  }
}
