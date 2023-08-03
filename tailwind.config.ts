import preset from './smarthr-ui-preset'

import type { Config } from 'tailwindcss'

module.exports = {
  presets: [preset],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
} satisfies Config
