import preset from './src/smarthr-ui-preset'

import type { Config } from 'tailwindcss'

export default {
  presets: [preset],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
} satisfies Config
