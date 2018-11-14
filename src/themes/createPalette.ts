import merge from 'lodash-es/merge'

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
