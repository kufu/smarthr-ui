import React from 'react'

import { Heading } from '../../Heading'
import { Stack } from '../../Layout'
import { Article, Aside, Nav, Section } from '../SectioningContent'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/SectioningContent',
  component: Section,
  subcomponents: { Article, Aside, Nav },
  render: (args) => (
    <Stack>
      <Section {...args}>
        <Heading>Section</Heading>
      </Section>
      <Article {...args}>
        <Heading>Article</Heading>
      </Article>
      <Aside {...args}>
        <Heading>Aside</Heading>
      </Aside>
      <Nav {...args}>
        <Heading>Nav</Heading>
      </Nav>
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Section>

export const Playground: StoryObj<typeof Section> = {}

export const BaseLevel: StoryObj<typeof Section> = {
  name: 'baseLevel',
  args: {
    baseLevel: 3,
  },
}
