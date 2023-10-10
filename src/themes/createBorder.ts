import { merge } from '../libs/lodash'

import { ColorProperty, defaultColor } from './createColor'

const defaultLineWidth = '1px'
const defaultLineStyle = 'solid'
const defaultLineColor = defaultColor.BORDER
const highContrastBorderColor = defaultColor.GREY_100

export type BorderProperty = {
  lineWidth?: string
  lineStyle?: string
  shorthand?: string
}

export type CreatedBorderTheme = {
  lineWidth: string
  lineStyle: string
  shorthand: string
  highContrast: string
}

export const defaultBorder: CreatedBorderTheme = {
  lineWidth: defaultLineWidth,
  lineStyle: defaultLineStyle,
  shorthand: `${defaultLineWidth} ${defaultLineStyle} ${defaultLineColor}`,
  highContrast: `${defaultLineWidth} ${defaultLineStyle} ${highContrastBorderColor}`,
}

export const createBorder = (userBorder: BorderProperty = {}, userColor: ColorProperty = {}) => {
  const color = userColor.BORDER || defaultColor.BORDER
  const created: CreatedBorderTheme = merge(
    {
      ...defaultBorder,
      shorthand: `${defaultLineWidth} ${defaultLineStyle} ${color}`,
    },
    userBorder,
  )

  return created
}
