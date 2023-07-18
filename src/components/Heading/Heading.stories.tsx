import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Section } from '../SectioningContent'

import { Heading, PageHeading } from './Heading'

export default {
  title: 'Text（テキスト）/Heading',
  component: Heading,
}

export const All: Story = () => (
  <>
    <PageHeading>Page Heading</PageHeading>
    <Section>
      <Heading visuallyHidden>Heading</Heading>
      <List>
        <li>
          <Section>
            <Heading type="screenTitle">ScreenTitle</Heading>
          </Section>
        </li>
        <li>
          <Section>
            <Heading type="sectionTitle">SectionTitle</Heading>
          </Section>
        </li>
        <li>
          <Section>
            <Heading type="blockTitle">BlockTitle</Heading>
          </Section>
        </li>
        <li>
          <Section>
            <Heading type="subBlockTitle">SubBlockTitle</Heading>
          </Section>
        </li>
        <li>
          <Section>
            <Heading type="subSubBlockTitle" tag="h4">
              SubSubBlockTitle
            </Heading>
          </Section>
        </li>
      </List>
    </Section>
  </>
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
