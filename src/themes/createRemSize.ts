const defaultHtmlFontSize = 16

export interface RemSizeProperty {
  XXS: string | number
  XS: string | number
  S: string | number
  M: string | number
  L: string | number
  XL: string | number
  XXL: string | number
}

const fontSize = ({ factor = 6, harmonic = 0, forLegacy = false }) => {
  const result = factor / (factor - harmonic)

  if (forLegacy) {
    return defaultHtmlFontSize * result
  }

  return `${result}rem`
}

export const createRemSize = (factor = 6) => ({
  XXS: String(fontSize({ factor, harmonic: -3 })),
  XS: String(fontSize({ factor, harmonic: -2 })),
  S: String(fontSize({ factor, harmonic: -1 })),
  M: String(fontSize({ factor, harmonic: 0 })),
  L: String(fontSize({ factor, harmonic: 1 })),
  XL: String(fontSize({ factor, harmonic: 2 })),
  XXL: String(fontSize({ factor, harmonic: 3 })),
})

export const defaultRemSize = createRemSize()

export const createRemSizeForPxToRem = (factor = 6, forLegacy = true) => ({
  XXS: Number(fontSize({ factor, harmonic: -3, forLegacy })),
  XS: Number(fontSize({ factor, harmonic: -2, forLegacy })),
  S: Number(fontSize({ factor, harmonic: -1, forLegacy })),
  M: Number(fontSize({ factor, harmonic: 0, forLegacy })),
  L: Number(fontSize({ factor, harmonic: 1, forLegacy })),
  XL: Number(fontSize({ factor, harmonic: 2, forLegacy })),
  XXL: Number(fontSize({ factor, harmonic: 3, forLegacy })),
})
