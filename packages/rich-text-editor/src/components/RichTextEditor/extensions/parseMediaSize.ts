import { getStyleProperty } from '@tiptap/core'

import { parseNumericAttr } from '../serializers/safeAttributes'

const PIXEL_LENGTH = /^(\d+(?:\.\d+)?)px(?:\s*!\s*important)?$/i

type Dimension = 'width' | 'height'

// element.style は DOM の実装ごとに正規化が違い、サーバーとブラウザで読める寸法が食い違う
const parsePixelStyle = (element: HTMLElement, property: Dimension) => {
  const match = PIXEL_LENGTH.exec(getStyleProperty(element, property) ?? '')
  const value = parseNumericAttr(match?.[1])

  // width/height 属性は整数で書く決まりなので、小数の px は丸める。0 に丸まる値は寸法として扱わない
  return value ? Math.round(value) || null : null
}

/**
 * Froala は大きさを変えると style に書き、width/height 属性は元のまま残す。
 * 属性と混ぜると縦横比が崩れるため、style に寸法があれば style だけから読む
 */
export const parseMediaSize = (
  element: HTMLElement,
  parseAttribute: (property: Dimension) => unknown,
): { width: unknown; height: unknown } => {
  const styleWidth = parsePixelStyle(element, 'width')
  const styleHeight = parsePixelStyle(element, 'height')
  const hasStyleSize = styleWidth !== null || styleHeight !== null

  return {
    width: hasStyleSize ? styleWidth : parseAttribute('width'),
    height: hasStyleSize ? styleHeight : parseAttribute('height'),
  }
}
