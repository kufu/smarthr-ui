import { RequiredLabel } from '../RequiredLabel'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'States（状態）/RequiredLabel',
  component: RequiredLabel,
  render: (args) => <RequiredLabel {...args} />,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {},
} satisfies Meta<typeof RequiredLabel>

export const Playground: StoryObj<typeof RequiredLabel> = {
  args: {},
}
