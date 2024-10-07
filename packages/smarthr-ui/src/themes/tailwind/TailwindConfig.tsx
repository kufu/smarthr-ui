import resolveConfig from 'tailwindcss/resolveConfig'

import presetConfig from '../../smarthr-ui-preset'

export const theme = resolveConfig(presetConfig).theme

export const { colors, textColor, fontSize, backgroundColor, lineHeight, boxShadow, spacing } =
  theme
