import { RequiredLabel } from '../RequiredLabel'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Components/StatusLabel/RequiredLabel',
  component: RequiredLabel,
  render: (args) => <RequiredLabel {...args} />,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof RequiredLabel>

export const Playground: StoryObj<typeof RequiredLabel> = {
  args: {},
}
