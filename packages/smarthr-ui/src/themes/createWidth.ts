import { defaultHtmlFontSize } from './createFontSize'

type PixelWidth = `${number}px`

// 基準画面解像度
const BASE_SCREEN_WIDTH = 1920
// 大外のpadding
const OUTER_PADDING = 4 * defaultHtmlFontSize * 2
// 溝幅
const GUTTER = 2 * defaultHtmlFontSize
// カラム数
const MAX_COLUMN_LENGTH = 12

// 基準画面解像度から左右padding（8rem(defaultHtmlFontSize*4*2))と溝幅（2rem*11(12-1))を引いた幅を12で割ったもの
const baseColumnWidth =
  (BASE_SCREEN_WIDTH - OUTER_PADDING - GUTTER * (MAX_COLUMN_LENGTH - 1)) / MAX_COLUMN_LENGTH

const calculateColumnWidths = () =>
  Object.fromEntries<string>(
    Array.from({ length: MAX_COLUMN_LENGTH }, (_, i) => {
      const colNum = i + 1
      const columnWidth = baseColumnWidth * colNum + GUTTER * (colNum - 1)
      return [`col${colNum}`, `${columnWidth}px`]
    }),
  ) as Record<`col${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`, PixelWidth>

const primitiveTokens = calculateColumnWidths()

export const defaultWidth = primitiveTokens
