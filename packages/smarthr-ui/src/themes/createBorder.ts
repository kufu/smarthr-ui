import { ColorProperty, defaultColor } from './createColor'

const defaultLineWidth = '1px'
const defaultLineStyle = 'solid'
const defaultLinePrefix = `${defaultLineWidth} ${defaultLineStyle} `

export type BorderProperty = {
  lineWidth?: string
  lineStyle?: string
  shorthand?: string
}

export type CreatedBorderTheme = Required<BorderProperty> & {
  highContrast: string
}

export const defaultBorder: CreatedBorderTheme = {
  lineWidth: defaultLineWidth,
  lineStyle: defaultLineStyle,
  shorthand: `${defaultLinePrefix}${defaultColor.BORDER}`,
  highContrast: `${defaultLinePrefix}${defaultColor.GREY_100}`,
}

export const createBorder = (userBorder: BorderProperty = {}, userColor: ColorProperty = {}) => {
  const userShorthand = userColor.BORDER
    ? { shorthand: `${defaultLinePrefix}${userColor.BORDER}` }
    : {}

  return {
    ...defaultBorder,
    ...userShorthand,
    ...userBorder,
  } as CreatedBorderTheme
}
