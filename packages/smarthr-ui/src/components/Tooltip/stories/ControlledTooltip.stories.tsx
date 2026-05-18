import { ControlledTooltip } from '../ControlledTooltip'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Tooltip（Internal）/ControlledTooltip',
  component: ControlledTooltip,
  render: (args) => <ControlledTooltip {...args}>吹き出し</ControlledTooltip>,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ControlledTooltip>

export const Playground: StoryObj<typeof ControlledTooltip> = {}

export const As: StoryObj<typeof ControlledTooltip> = {
  name: 'as',
  args: {
    as: 'span',
  },
}
