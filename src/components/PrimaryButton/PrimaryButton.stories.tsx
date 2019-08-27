// import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { PrimaryButton } from './PrimaryButton'

storiesOf('PrimaryButton', module).add('all', () => (
  <List>
    <li>
      <PrimaryButton>Button</PrimaryButton>
    </li>
    <li>
      <PrimaryButton tag="a">Anchor</PrimaryButton>
    </li>
  </List>
))

const List = styled.ul`
  padding: 0 2.4rem;
  list-style: none;

  & > li {
    &:not(:first-child) {
      margin-top: 2.4rem;
    }

    & > *:not(:first-child) {
      margin-left: 1.6rem;
    }
  }
`
// const Background = styled.div`
//   display: inline-block;
//   padding: 0.8rem;
//   background-color: #0dbac1;
// `
