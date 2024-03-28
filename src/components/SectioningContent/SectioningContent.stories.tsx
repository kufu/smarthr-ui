import { StoryFn } from '@storybook/react'
import React from 'react'

import { Heading, PageHeading } from '../Heading'

import { Article, Aside, Nav, Section, SectioningFragment } from './SectioningContent'

export default {
  title: 'Navigation（ナビゲーション）/SectioningContent',
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

export const SectioningContent: StoryFn = () => (
  <>
    <PageHeading>h1</PageHeading>
    <Section>
      {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
      <PageHeading>PageHeading: Headingと違い、SectioningContent中でも常にh1を出力する</PageHeading>
    </Section>
    {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
    <Heading>Heading without SectioningContent: h1</Heading>
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
SectioningContent.storyName = 'SectioningContent'
