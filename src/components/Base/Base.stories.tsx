import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { Base } from './Base'

storiesOf('Base', module).add('all', () => (
  <>
    <Base radius="s">
      <span>6px radius</span>
    </Base>
    <Base>
      <span>8px radius</span>
    </Base>
  </>
))
