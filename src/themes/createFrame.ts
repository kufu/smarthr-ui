import { merge } from '../libs/lodash'

import { PaletteProperty, defaultPalette } from './createPalette'

const lineWidth = '1px'
const lineStyle = 'solid'
const lineColor = defaultPalette.BORDER

export type FrameProperty = {
  border?: {
    lineWidth?: string
    lineStyle?: string
    default?: string
    radius?: {
      s?: string
      m?: string
      l?: string
    }
  }
}

export type CreatedFrameTheme = {
  border: {
    lineWidth: string
    lineStyle: string
    default: string
    radius: {
      s: string
      m: string
    }
  }
}

/**
 * @deprecated The defaultFrame will be deprecated, please use defaultBorder or defaultRadius instead
 */
export const defaultFrame: CreatedFrameTheme = {
  border: {
    lineWidth,
    lineStyle,
    default: `${lineWidth} ${lineStyle} ${lineColor}`,
    radius: {
      s: '4px',
      m: '6px',
    },
  },
}

export const createFrame = (userFrame: FrameProperty = {}, userPalette: PaletteProperty = {}) => {
  const color = userPalette.BORDER || defaultPalette.BORDER
  const created: CreatedFrameTheme = merge(
    {
      border: {
        ...defaultFrame.border,
        default: `${lineWidth} ${lineStyle} ${color}`,
        radius: { ...defaultFrame.border.radius },
      },
    },
    userFrame,
  )

  return created
}
