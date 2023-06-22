import React, { Story } from '@storybook/react'

import { Heading } from '../Heading'

import { Article, Aside, Nav, Section, SectioningFragment } from './SectioningContent'

export default {
  title: 'SectioningContent',
  component: Section,
  subcomponents: {
    Article,
    Aside,
    Nav,
    Section,
    SectioningFragment,
  },
  parameters: {
    withTheming: true,
  },
}

export const SectioningContentStyle: Story = () => (
  <>
    <Heading>h1</Heading>
    <Nav>
      <Heading>Nav: h2</Heading>
    </Nav>
    <Section>
      <Heading>h2</Heading>
      <Section>
        <Heading>h3</Heading>
        <Section>
          <Heading>h4</Heading>
          <Section>
            <Heading>h5</Heading>
            <Section>
              <Heading>h6</Heading>
              <Section>
                <Heading>span</Heading>
              </Section>
            </Section>
          </Section>
          <Article>
            <Heading>Article: h5</Heading>
          </Article>
        </Section>
      </Section>
      <SectioningFragment>
        <Heading>h3</Heading>
      </SectioningFragment>
    </Section>
    <Aside>
      <Heading>Aside: h2</Heading>
    </Aside>
  </>
)
SectioningContentStyle.storyName = 'SectioningContent style'
