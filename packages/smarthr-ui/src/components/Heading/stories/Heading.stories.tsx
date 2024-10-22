/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import React from 'react'

import { Stack } from '../../Layout'
import { Heading, PageHeading } from '../Heading'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Text（テキスト）/Heading',
  component: Heading,
  subcomponents: { PageHeading },
  render: (args) => <Heading {...args}>Heading</Heading>,
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Heading>

export const HeadingControl: StoryObj<typeof Heading> = {
  name: 'Playground',
  args: {},
}

export const Type: StoryObj<typeof Heading> = {
  name: 'type',
  render: (args) => (
    <Stack>
      <Heading {...args} type="screenTitle">
        ScreenTitle
      </Heading>
      <Heading {...args} type="sectionTitle">
        SectionTitle
      </Heading>
      <Heading {...args} type="blockTitle">
        BlockTitle
      </Heading>
      <Heading {...args} type="subBlockTitle">
        SubBlockTitle
      </Heading>
      <Heading {...args} type="subSubBlockTitle">
        SubSubBlockTitle
      </Heading>
    </Stack>
  ),
}

export const Tag: StoryObj<typeof Heading> = {
  name: 'tag(非推奨)',
  render: (args) => (
    <Stack>
      <Heading {...args}>未指定(推奨)</Heading>
      <Heading {...args} tag="h1">
        h1
      </Heading>
      <Heading {...args} tag="h2">
        h2
      </Heading>
      <Heading {...args} tag="h3">
        h3
      </Heading>
      <Heading {...args} tag="h4">
        h4
      </Heading>
      <Heading {...args} tag="h5">
        h5
      </Heading>
      <Heading {...args} tag="h6">
        h6
      </Heading>
    </Stack>
  ),
}

export const VisuallyHidden: StoryObj<typeof Heading> = {
  name: 'visuallyHidden',
  render: (args) => (
    <Stack>
      <Heading {...args} visuallyHidden={true}>
        visuallyHidden={true}
      </Heading>
      <Heading {...args} visuallyHidden={false}>
        visuallyHidden=false:
      </Heading>
    </Stack>
  ),
}
