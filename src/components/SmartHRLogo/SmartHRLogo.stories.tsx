import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { SmartHRLogo } from './SmartHRLogo'

import styled from 'styled-components'

storiesOf('SmartHRLogo', module).add('all', () => (
  <List>
    <li>
      <Text>default</Text>
      <SmartHRLogo />
    </li>
    <li>
      <Text>You can set custom title and custom fill color</Text>
      <SmartHRLogo title="custom title" fill="#008d91" />
    </li>
  </List>
))

const List = styled.ul`
  margin: 0;
  padding: 8px;
  background-color: #00c4cc;

  & > li {
    display: inline-block;
    padding: 16px;
  }
`
const Text = styled.p`
  margin: 0 0 8px 0;
  font-size: 16px;
`
