import { merge } from '../libs/lodash'
import { PaletteProperty, defaultPalette } from './createPalette'

const lineWidth = '1px'
const lineStyle = 'solid'
const lineColor = defaultPalette.BORDER

export interface FrameProperty {
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

export interface CreatedFrameTheme {
  border: {
    lineWidth: string
    lineStyle: string
    default: string
    radius: {
      s: string
      m: string
      l: string
    }
  }
}

export const defaultFrame: CreatedFrameTheme = {
  border: {
    lineWidth,
    lineStyle,
    default: `${lineWidth} ${lineStyle} ${lineColor}`,
    radius: {
      s: '3px',
      m: '6px',
      l: '8px',
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
      },
    },
    userFrame,
  )

  return created
}
