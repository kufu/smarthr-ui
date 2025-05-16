
import { Button } from '../../Button/'
import { Disclosure, DisclosureTrigger, DisclosureContent } from '../Disclosure'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Disclosure',
  component: Disclosure,
  subcomponents: {
    DisclosureTrigger,
    DisclosureContent,
  },
  render: (args) => (
    <Disclosure {...args} trigger={<Button>Disclosure</Button>}>
      Disclosure Content.
    </Disclosure>
  ),
  argTypes: {},
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Disclosure>

export const Playground: StoryObj<typeof Disclosure> = {
  args: {},
}

export const Open: StoryObj<typeof Disclosure> = {
  name: 'open',
  args: {
    open: true,
  },
}

export const VisuallyHidden: StoryObj<typeof Disclosure> = {
  name: 'visuallyHidden',
  args: {
    visuallyHidden: true,
  },
}
