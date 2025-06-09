import path from 'path'
import { StorybookConfig } from '@storybook/react-webpack5'
import { DefinePlugin, ProvidePlugin } from 'webpack'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-storysource',
      options: {
        rule: {
          test: [/\.stories\.jsx?$/],
          include: [path.resolve(__dirname, '../src')],
        },
        loaderOptions: {
          prettierConfig: {
            printWidth: 80,
            singleQuote: false,
          },
        },
      },
    },
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          // Replaces existing CSS rules to support PostCSS
          {
            test: /\.css$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: { importLoaders: 1 },
              },
              {
                // Gets options from `postcss.config.js` in your project root
                loader: 'postcss-loader',
                options: { implementation: require.resolve('postcss') },
              },
            ],
          },
        ],
      },
    },
    'storybook-addon-pseudo-states',
    '@storybook/addon-webpack5-compiler-babel',
  ],
  refs: {
    'smarthr-patterns': {
      title: 'SmartHR Patterns',
      url: 'https://main--62f0ae48c21b0728fd1a5c85.chromatic.com',
    },
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: ['../public'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  webpackFinal: async (config) => {
    const resolve = config.resolve || {}
    resolve.alias = {
      ...resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    }

    // Storybook 9でprocess polyfillが必要
    resolve.fallback = {
      ...resolve.fallback,
      process: require.resolve('process/browser'),
    }

    const plugins = config.plugins || []
    plugins.push(
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.STORYBOOK_NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      }),
      new ProvidePlugin({
        process: 'process/browser',
      }),
    )

    return {
      ...config,
      resolve,
      plugins,
    }
  },
}

export default config
