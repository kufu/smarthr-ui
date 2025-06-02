import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'SmartHR UI',
    // brandImage: logo, // SVG型定義の問題で一時的にコメントアウト
  }),
})
