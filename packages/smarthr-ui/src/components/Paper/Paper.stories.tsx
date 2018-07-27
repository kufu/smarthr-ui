import * as React from 'react'
import { storiesOf } from '@storybook/react'

import Paper from './Paper'

storiesOf('Paper/radius', module)
  .add('default', () => <Paper>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Paper>)
  .add('0', () => <Paper radius={0}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Paper>)
