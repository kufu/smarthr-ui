import { merge } from '../libs/lodash'
import { ColorProperty, defaultColor } from './createColor'

const lineWidth = '1px'
const lineStyle = 'solid'
const lineColor = defaultColor.BORDER

export interface BorderProperty {
  lineWidth?: string
  lineStyle?: string
  default?: string
}

export interface CreatedBorderTheme {
  lineWidth: string
  lineStyle: string
  default: string
}

export const defaultBorder: CreatedBorderTheme = {
  lineWidth,
  lineStyle,
  default: `${lineWidth} ${lineStyle} ${lineColor}`,
}

export const createBorder = (userBorder: BorderProperty = {}, userColor: ColorProperty = {}) => {
  const color = userColor.BORDER || defaultColor.BORDER
  const created: CreatedBorderTheme = merge(
    {
      ...defaultBorder,
      default: `${lineWidth} ${lineStyle} ${color}`,
    },
    userBorder,
  )

  return created
}
