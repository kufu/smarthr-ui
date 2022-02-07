import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Heading } from './Heading'

import readme from './README.md'

export default {
  title: 'Heading',
  component: Heading,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

export const All: Story = () => (
  <List>
    <li>
      <Heading type="screenTitle" tag="h1">
        ScreenTitle
      </Heading>
    </li>
    <li>
      <Heading type="sectionTitle" tag="h2">
        SectionTitle
      </Heading>
    </li>
    <li>
      <Heading type="blockTitle" tag="h3">
        BlockTitle
      </Heading>
    </li>
    <li>
      <Heading type="subBlockTitle" tag="h4">
        SubBlockTitle
      </Heading>
    </li>
    <li>
      <Heading type="subSubBlockTitle" tag="h5">
        SubSubBlockTitle
      </Heading>
    </li>
  </List>
)
All.storyName = 'all'

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
