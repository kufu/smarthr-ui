import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { IconLogo } from './IconLogo'

import styled from 'styled-components'

storiesOf('IconLogo', module).add('all', () => (
  <List>
    <li>
      <IconLogo />
    </li>
    <li>
      <IconLogo fill="#008d91" />
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
