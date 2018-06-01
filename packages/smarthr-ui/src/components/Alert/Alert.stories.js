import React from 'react'
import { storiesOf } from '@storybook/react'

import Alert from './Alert'

storiesOf('Alert', module).add('success', () => (
  <Alert type="success">success!!</Alert>
))
storiesOf('Alert', module).add('info', () => <Alert type="info">info!!</Alert>)
storiesOf('Alert', module).add('warning', () => (
  <Alert type="warning">warning!!</Alert>
))
storiesOf('Alert', module).add('danger', () => (
  <Alert type="danger">danger!!</Alert>
))
