import { Stack } from '../../Layout'
import { Chip, classNameGenerator } from '../Chip'

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
      options: Object.keys(classNameGenerator.variants.color),
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
      {[undefined, ...Object.keys(classNameGenerator.variants.size)].map((size) => (
        <Chip {...args} size={size as any} key={String(size)} />
      ))}
    </Stack>
  ),
}

export const Color: StoryObj<typeof Chip> = {
  name: 'color',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, ...Object.keys(classNameGenerator.variants.color)].map((color) => (
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
