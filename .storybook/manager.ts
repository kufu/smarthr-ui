import addons from '@storybook/addons'
import { create } from '@storybook/theming'
import logo from './logo.svg'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'SmartHR UI',
    brandImage: logo,
  }),
})
