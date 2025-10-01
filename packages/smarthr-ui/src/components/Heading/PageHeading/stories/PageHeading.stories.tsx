import { ComponentPropsWithoutRef } from 'react'
import { Stack } from '../../../Layout'
import { PageHeading } from '../PageHeading'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Components/Heading/PageHeading',
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

export const Size: StoryObj<typeof PageHeading> = {
  name: 'size',
  render: (args: Omit<ComponentPropsWithoutRef<typeof PageHeading>, 'type'>) => (
    <Stack>
      <PageHeading {...args} type="screenTitle" size="XXL">
        ScreenTitle XXL
      </PageHeading>
      <PageHeading {...args} type="screenTitle" size="XL">
        ScreenTitle XL
      </PageHeading>
      <PageHeading {...args} type="sectionTitle" size="XXL">
        SectionTitle XXL
      </PageHeading>
      <PageHeading {...args} type="sectionTitle" size="XL">
        SectionTitle XL
      </PageHeading>
      <PageHeading {...args} type="sectionTitle" size="L">
        SectionTitle L
      </PageHeading>
    </Stack>
  ),
}

export const VisuallyHidden: StoryObj<typeof PageHeading> = {
  name: 'visuallyHidden',
  render: (args) => (
    <Stack>
      <PageHeading {...args} visuallyHidden={true}>
        visuallyHidden=true
      </PageHeading>
      <PageHeading {...args} visuallyHidden={false}>
        visuallyHidden=false:
      </PageHeading>
    </Stack>
  ),
}
