import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { Section } from '../SectioningContent'

import { Heading, PageHeading } from './Heading'

export default {
  title: 'Text（テキスト）/Heading',
  component: Heading,
}

export const All: StoryFn = () => (
  <>
    <StyledPageHeading>Page Heading</StyledPageHeading>
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
            {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
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

const StyledPageHeading = styled(PageHeading)`
  padding: 0 2.4rem 2.4rem;
`

const List = styled.ul`
  margin-block: unset;
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
