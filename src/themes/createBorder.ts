import { merge } from '../libs/lodash'
import { ColorProperty, defaultColor } from './createColor'

const lineWidth = '1px'
const lineStyle = 'solid'
const lineColor = defaultColor.BORDER

export interface BorderProperty {
  lineWidth?: string
  lineStyle?: string
  shorthand?: string
}

export interface CreatedBorderTheme {
  lineWidth: string
  lineStyle: string
  shorthand: string
}

export const defaultBorder: CreatedBorderTheme = {
  lineWidth,
  lineStyle,
  shorthand: `${lineWidth} ${lineStyle} ${lineColor}`,
}

export const createBorder = (userBorder: BorderProperty = {}, userColor: ColorProperty = {}) => {
  const color = userColor.BORDER || defaultColor.BORDER
  const created: CreatedBorderTheme = merge(
    {
      ...defaultBorder,
      shorthand: `${lineWidth} ${lineStyle} ${color}`,
    },
    userBorder,
  )

  return created
}
