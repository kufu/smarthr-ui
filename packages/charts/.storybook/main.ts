import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: false,
  },
  viteFinal: async (conf) => ({
    ...conf,
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
  }),
}

export default config
