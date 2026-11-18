import SmartHRUIPreset from '../smarthr-ui/src/smarthr-ui-preset'

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [SmartHRUIPreset],
  prefix: 'shr-rte-',
  content: {
    relative: true,
    files: ['./src/**/*.{js,ts,jsx,tsx}', '!./src/**/*.test.{ts,tsx}'],
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
