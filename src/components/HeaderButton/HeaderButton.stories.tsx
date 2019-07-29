import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { HeaderButton } from './HeaderButton'
import { FaPlusCircle } from 'react-icons/fa'

import styled from 'styled-components'

storiesOf('HeaderButton', module).add('all', () => (
  <List>
    <li>
      <HeaderButton icon={FaPlusCircle}>hoge</HeaderButton>
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
