import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Textarea } from './Textarea'

storiesOf('Textarea', module).add('all', () => (
  <List>
    <li>
      <Txt>normal</Txt>
      <Textarea />
    </li>
    <li>
      <Txt>width</Txt>
      <Textarea width="100%" />
    </li>
    <li>
      <Txt>disabled</Txt>
      <Textarea disabled={true} />
    </li>
    <li>
      <Txt>error</Txt>
      <Textarea error={true} />
    </li>
    <li>
      <Txt>maxLength</Txt>
      <Textarea maxLength={140} defaultValue="message" />
    </li>
  </List>
))

const List = styled.ul`
  padding: 0 24px;
  list-style: none;

  & > li:not(:first-child) {
    margin-top: 16px;
  }
`
const Txt = styled.p`
  margin: 0 0 8px 0;
`
