import { join } from 'path'

import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

import type { StorybookConfig } from '@storybook/react-vite'

export default {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', 'storybook-addon-pseudo-states'],
  refs: {
    'smarthr-patterns': {
      title: 'SmartHR Patterns',
      url: 'https://main--62f0ae48c21b0728fd1a5c85.chromatic.com',
    },
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@': join(__dirname, '../src'),
      },
    },
    define: {
      ...config.define,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.STORYBOOK_NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
  }),
} satisfies StorybookConfig
