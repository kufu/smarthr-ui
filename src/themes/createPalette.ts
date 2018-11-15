// tslint:disable-next-line:no-var-requires
const merge = require('lodash.merge') // import 文だと runtime エラーが出てしまう・・・

const color = {
  turquoise: '#00C4CC',
}

export interface PaletteProperty {
  primary?: string
}

export interface CreatedPaletteTheme {
  primary: string
}

export const createPalette = (palette: PaletteProperty = {}) => {
  const created: CreatedPaletteTheme = merge(
    {
      primary: color.turquoise,
    },
    palette,
  )

  return created
}
