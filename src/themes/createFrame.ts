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
  const color = userPalette.Mono_P20 || defaultPalette.Mono_P20
  const created: CreatedFrameTheme = merge(
    {
      border: {
        lineWidth,
        lineStyle,
        default: `${lineWidth} ${lineStyle} ${color}`,
        radius: '8px',
      },
    },
    userFrame,
  )

  return created
}
