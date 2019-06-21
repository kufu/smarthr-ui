import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { AppBar } from './AppBar'
import readme from './README.md'

storiesOf('AppBar', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('AppBar', () => (
    <AppBar pcSize="l" tabletSize="m" spSize="s">
      AppBar Component
    </AppBar>
  ))
