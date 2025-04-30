import type { Meta, StoryObj } from '@storybook/react'
import { Localizer } from '../'

export default {
  title: 'Internal（内部）/Localizer',
  component: Localizer,
  render: (args) => <Localizer {...args} />,
  args: {
    id: 'smarthr-ui/common/language',
    defaultText: '日本語',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Localizer>

type Story = StoryObj<typeof Localizer>

export const Playground: Story = {}
