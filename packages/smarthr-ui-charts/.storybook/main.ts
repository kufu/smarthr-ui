import type { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-webpack5-compiler-babel',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: false,
    checkOptions: {},
  },
  babel: async (options, { configType }) => {
    options.presets = [
      ['@babel/preset-env', { targets: { chrome: 100 } }],
      ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
      ['@babel/preset-react', { runtime: 'automatic' }],
    ]
    return options
  },
  webpackFinal: async (conf) => {
    conf.resolve.extensions.push('.ts', '.tsx')
    return conf
  },
}

export default config
