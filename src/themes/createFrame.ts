import { merge } from '../libs/lodash'
import { defaultPalette, PaletteProperty } from './createPalette'

const lineWidth = '1px'
const lineStyle = 'solid'

export interface FrameProperty {
  border?: {
    lineWidth?: string
    lineStyle?: string
    default?: string
    radius?: string
  }
}

export interface CreatedFrameTheme {
  border: {
    lineWidth: string
    lineStyle: string
    default: string
    radius: string
  }
}

export const createFrame = (userFrame: FrameProperty = {}, userPalette: PaletteProperty = {}) => {
  const line = userPalette.line || defaultPalette.line
  const created: CreatedFrameTheme = merge(
    {
      border: {
        lineWidth,
        lineStyle,
        default: `${lineWidth} ${lineStyle} ${line}`,
        radius: '3px',
      },
    },
    userFrame,
  )

  return created
}
