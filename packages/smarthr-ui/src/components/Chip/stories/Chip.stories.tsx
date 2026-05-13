import { Stack } from '../../Layout'
import { Chip } from '../Chip'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Chip',
  component: Chip,
  render: (args) => <Chip {...args} />,
  argTypes: {
    size: {
      control: 'select',
    },
    color: {
      control: 'select',
      options: ['grey', 'blue', 'green', 'orange', 'red'],
    },
  },
  args: {
    children: 'ラベル',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Chip>

export const Playground: StoryObj<typeof Chip> = {}

export const Size: StoryObj<typeof Chip> = {
  name: 'size',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, 's'].map((size) => (
        <Chip {...args} size={size as any} key={String(size)} />
      ))}
    </Stack>
  ),
}

export const Color: StoryObj<typeof Chip> = {
  name: 'color',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, 'grey', 'blue', 'green', 'orange', 'red'].map((color) => (
        <Chip {...args} color={color as any} key={String(color)} />
      ))}
    </Stack>
  ),
}

export const Disabled: StoryObj<typeof Chip> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}
