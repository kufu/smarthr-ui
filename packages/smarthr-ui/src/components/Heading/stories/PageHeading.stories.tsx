/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import React from 'react'

import { Stack } from '../../Layout'
import { PageHeading } from '../Heading'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Text（テキスト）/Heading/PageHeading',
  component: PageHeading,
  render: (args) => <PageHeading {...args}>PageHeading</PageHeading>,
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof PageHeading>

export const PageHeadingControl: StoryObj<typeof PageHeading> = {
  name: 'Playground',
  args: {},
}

export const Type: StoryObj<typeof PageHeading> = {
  name: 'type',
  render: (args) => (
    <Stack>
      <PageHeading {...args} type="screenTitle">
        ScreenTitle
      </PageHeading>
      <PageHeading {...args} type="sectionTitle">
        SectionTitle
      </PageHeading>
      <PageHeading {...args} type="blockTitle">
        BlockTitle
      </PageHeading>
      <PageHeading {...args} type="subBlockTitle">
        SubBlockTitle
      </PageHeading>
      <PageHeading {...args} type="subSubBlockTitle">
        SubSubBlockTitle
      </PageHeading>
    </Stack>
  ),
}
