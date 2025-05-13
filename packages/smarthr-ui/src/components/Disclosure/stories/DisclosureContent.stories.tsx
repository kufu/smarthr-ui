import { action } from '@storybook/addon-actions'
import { ComponentProps } from 'react'

import { Button } from '../../Button'
import { Stack, Cluster } from '../../Layout'
import { DisclosureTrigger, DisclosureContent } from '../Disclosure'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Disclosure/DisclosureContent',
  component: DisclosureContent,
  render: (args) => (
    <Stack>
      <Cluster>
        <DisclosureTrigger targetId="disclosure_1">
          <Button>Disclosure</Button>
        </DisclosureTrigger>
        <Button>other button</Button>
      </Cluster>
      <DisclosureContent {...args} id="disclosure_1">
        Disclosure Content.
      </DisclosureContent>
    </Stack>
  ),
  argTypes: {},
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DisclosureContent>

export const Playground: StoryObj<typeof DisclosureContent> = {
  args: {},
}

export const Open: StoryObj<typeof DisclosureContent> = {
  name: 'open',
  args: {
    open: true,
  },
}

export const VisuallyHidden: StoryObj<typeof DisclosureContent> = {
  name: 'visuallyHidden',
  args: {
    visuallyHidden: true,
  },
}
