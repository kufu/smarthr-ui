import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Section } from '../SectioningContent'

import { Heading } from './Heading'

export default {
  title: 'Text（テキスト）/Heading',
  component: Heading,
}

export const All: Story = () => (
  <Section>
    <Heading visuallyHidden>Heading</Heading>
    <List>
      <li>
        <Heading type="screenTitle">ScreenTitle</Heading>
      </li>
      <li>
        <Heading type="sectionTitle">SectionTitle</Heading>
      </li>
      <li>
        <Heading type="blockTitle" tag="h3">
          BlockTitle
        </Heading>
      </li>
      <li>
        <Heading type="subBlockTitle">SubBlockTitle</Heading>
      </li>
      <li>
        <Heading type="subSubBlockTitle">SubSubBlockTitle</Heading>
      </li>
    </List>
  </Section>
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
