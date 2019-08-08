import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { AppNavi } from './AppNavi'
import { Props as IconProps } from '../Icon/Icon'

const buttons = [
  {
    label: 'ボタン1',
    icon: 'fa-file' as IconProps['name'],
    current: true,
  },
  {
    label: 'ボタン2',
    icon: 'fa-user-alt' as IconProps['name'],
    url: '/',
  },
  {
    label: 'ボタン3',
    icon: 'fa-cog' as IconProps['name'],
    url: '/',
  },
]

storiesOf('AppNavi', module).add('all', () => (
  <AppNavi label="プラスメニュー" buttons={buttons}></AppNavi>
))
