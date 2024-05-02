import SmartHRUIPreset from 'smarthr-ui/lib/smarthr-ui-preset'

import type { Config } from 'tailwindcss'

const config: Config = {
  presets: [SmartHRUIPreset],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/smarthr-ui/lib/**/*.js',
  ],
}
export default config
