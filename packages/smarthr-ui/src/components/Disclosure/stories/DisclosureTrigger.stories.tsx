import { action } from '@storybook/addon-actions'
import { ComponentProps } from 'react'

import { Button } from '../../Button'
import { Stack, Cluster } from '../../Layout'
import { DisclosureTrigger, DisclosureContent } from '../Disclosure'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Disclosure/DisclosureTrigger',
  component: DisclosureTrigger,
  render: (args) => (
    <Stack>
      <Cluster>
        <DisclosureTrigger {...args} targetId="disclosure_1">
          <Button>Disclosure</Button>
        </DisclosureTrigger>
        <Button>other button</Button>
      </Cluster>
      <DisclosureContent id="disclosure_1">Disclosure Content.</DisclosureContent>
    </Stack>
  ),
  argTypes: {},
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DisclosureTrigger>

export const Playground: StoryObj<typeof DisclosureTrigger> = {
  args: {},
}

export const OnClick: StoryObj<typeof DisclosureTrigger> = {
  name: 'onClick',
  args: {
    onClick: (toggle, e) => {
      console.log('onClick', e)
      toggle()
    },
  },
}
