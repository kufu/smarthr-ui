import SmartHRUIPreset from 'smarthr-ui/lib/smarthr-ui-preset'

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [SmartHRUIPreset],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
