import * as React from 'react'
import { storiesOf } from '@storybook/react'

import Balloon from './Balloon'

const Inner = ({ children }: any) => <div style={{ padding: '5px 10px' }}>{children}</div>
const dummyText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'

storiesOf('Balloon/theme', module)
  .add('light', () => (
    <Balloon theme="light" horizontal="center" vertical="bottom">
      <Inner>{dummyText}</Inner>
    </Balloon>
  ))
  .add('dark', () => (
    <Balloon theme="dark" horizontal="center" vertical="bottom">
      <Inner>{dummyText}</Inner>
    </Balloon>
  ))

storiesOf('Balloon/horizontal', module)
  .add('right', () => (
    <Balloon theme="light" horizontal="right" vertical="bottom">
      <Inner>{dummyText}</Inner>
    </Balloon>
  ))
  .add('center', () => (
    <Balloon theme="light" horizontal="center" vertical="bottom">
      <Inner>{dummyText}</Inner>
    </Balloon>
  ))
  .add('left', () => (
    <Balloon theme="light" horizontal="left" vertical="bottom">
      <Inner>{dummyText}</Inner>
    </Balloon>
  ))

storiesOf('Balloon/vertical', module)
  .add('top', () => (
    <Balloon theme="light" horizontal="center" vertical="top">
      <Inner>{dummyText}</Inner>
    </Balloon>
  ))
  .add('bottom', () => (
    <Balloon theme="light" horizontal="center" vertical="bottom">
      <Inner>{dummyText}</Inner>
    </Balloon>
  ))
