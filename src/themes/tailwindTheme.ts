import resolveConfig from 'tailwindcss/resolveConfig'

import presetConfig from '../../smarthr-ui-preset'

const { theme } = resolveConfig(presetConfig)

export { theme }
