import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { AppBar } from './AppBar'

storiesOf('AppBar', module).add('all', () => (
  <AppBar pcSize="l" tabletSize="m" spSize="s">
    AppBar Component
  </AppBar>
))
