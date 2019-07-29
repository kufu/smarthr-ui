import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { SmartHRLogo } from './SmartHRLogo'

import styled from 'styled-components'

storiesOf('SmartHRLogo', module).add('all', () => (
  <List>
    <li>
      <SmartHRLogo />
    </li>
    <li>
      <SmartHRLogo size="large" />
    </li>
  </List>
))

const List = styled.ul`
  display: block;
  padding: 0;
  margin: 0;

  & > li {
    display: inline-block;
    padding: 1rem;
    margin: 0 1rem 1rem 0;
    background-color: #00c4cc;
  }
`
