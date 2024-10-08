import resolveConfig from 'tailwindcss/resolveConfig'

import presetConfig from '../../smarthr-ui-preset'

export const { colors, textColor, fontSize, backgroundColor, lineHeight, boxShadow, spacing } =
  resolveConfig(presetConfig).theme
