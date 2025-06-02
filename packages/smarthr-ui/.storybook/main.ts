import path from 'path'
import { StorybookConfig } from '@storybook/react-webpack5'
import { DefinePlugin } from 'webpack'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-a11y',
    'storybook-addon-pseudo-states',
    '@storybook/addon-webpack5-compiler-babel',
    '@storybook/addon-docs',
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

    // Storybook 9.0対応: process, util等のpolyfillを追加
    resolve.fallback = {
      ...resolve.fallback,
      process: require.resolve('process/browser'),
      util: require.resolve('util'),
    }

    // PostCSS設定を直接追加（addon-styling-webpackの代替）
    const rules = config.module?.rules || []

    // 既存のCSS rulesを除去
    const filteredRules = rules.filter((rule) => {
      if (typeof rule === 'object' && rule !== null && 'test' in rule) {
        const test = rule.test
        if (test instanceof RegExp) {
          return !test.test('.css')
        }
      }
      return true
    })

    // PostCSS対応のCSS ruleを追加
    filteredRules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { importLoaders: 1 },
        },
        {
          loader: 'postcss-loader',
          options: { implementation: require.resolve('postcss') },
        },
      ],
    })

    // Storybook 9.0対応: processとBuffer等のグローバル変数を定義
    const plugins = config.plugins || []
    plugins.push(
      new DefinePlugin({
        process: 'process',
        global: 'globalThis',
      }),
    )

    return {
      ...config,
      resolve,
      module: {
        ...config.module,
        rules: filteredRules,
      },
      plugins,
    }
  },
}

export default config
