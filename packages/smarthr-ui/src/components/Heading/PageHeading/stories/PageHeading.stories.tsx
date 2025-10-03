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

export const Size: StoryObj<typeof PageHeading> = {
  name: 'size',
  render: (args: Omit<ComponentPropsWithoutRef<typeof PageHeading>, 'type'>) => (
    <Stack>
      <PageHeading {...args} size="XXL">
        ScreenTitle XXL
      </PageHeading>
      <PageHeading {...args} size="XL">
        ScreenTitle XL
      </PageHeading>
      <PageHeading {...args} size="XXL">
        SectionTitle XXL
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
