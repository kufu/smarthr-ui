import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { AppNavi } from './AppNavi'

const buttons = [
  {
    children: 'ボタン1',
    icon: 'fa-file' as const,
    current: true,
  },
  {
    children: 'ボタン2',
    icon: 'fa-user-alt' as const,
    onClick: action('click!!'),
  },
  {
    children: 'ボタン3',
    icon: 'fa-cog' as const,
    onClick: action('click!!'),
  },
]

storiesOf('AppNavi', module).add('all', () => (
  <AppNavi label="プラスメニュー" buttons={buttons}></AppNavi>
))
