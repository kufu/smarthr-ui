import { merge } from '../libs/lodash'

const color = {
  white: '#fff',
  gray: '#dfdfdf',
  black: '#222',

  turquoise: '#00C4CC',
}

export interface PaletteProperty {
  base?: string
  default?: string
  line?: string
  primary?: string
}

export interface CreatedPaletteTheme {
  base: string
  default: string
  line: string
  primary: string
}

export const defaultPalette: CreatedPaletteTheme = {
  base: color.white,
  default: color.black,

  line: color.gray,

  primary: color.turquoise,
}

export const createPalette = (userPalette: PaletteProperty = {}) => {
  const created = merge(defaultPalette, userPalette)
  return created
}
