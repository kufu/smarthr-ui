import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'
import { Heading } from './Heading'

storiesOf('Heading', module).add('all', () => (
  <List>
    <li>
      <Heading type="ScreenTitle" tag="h1">
        ScreenTitle
      </Heading>
    </li>
    <li>
      <Heading type="SectionTitle" tag="h2">
        SectionTitle
      </Heading>
    </li>
    <li>
      <Heading type="BlockTitle" tag="h3">
        BlockTitle
      </Heading>
    </li>
    <li>
      <Heading type="SubBlockTitle" tag="h4">
        SubBlockTitle
      </Heading>
    </li>
    <li>
      <Heading type="SubSubBlockTitle" tag="h5">
        SubSubBlockTitle
      </Heading>
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
