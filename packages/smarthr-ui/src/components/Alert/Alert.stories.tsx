import * as React from 'react'
import { storiesOf } from '@storybook/react'

import Alert from './Alert'

storiesOf('Alert', module)
  .add('success', () => <Alert type="success">success!!</Alert>)
  .add('info', () => <Alert type="info">info!!</Alert>)
  .add('warning', () => <Alert type="warning">warning!!</Alert>)
  .add('danger', () => <Alert type="danger">danger!!</Alert>)
