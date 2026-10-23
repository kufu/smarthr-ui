import { Stack } from '../../Layout'
import { Switch } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Switch',
  component: Switch,
  render: (args) => <Switch {...args} />,
  args: {
    children: 'ラベル',
  },
  argTypes: {
    unrecommendedLabelHidden: {
      control: 'boolean',
    },
    defaultChecked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['S', 'M'],
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Switch>

export const Playground: StoryObj<typeof Switch> = {}

export const UnrecommendedLabelHidden: StoryObj<typeof Switch> = {
  name: 'unrecommendedLabelHidden',
  args: {
    unrecommendedLabelHidden: true,
  },
}

export const DefaultChecked: StoryObj<typeof Switch> = {
  name: 'defaultChecked',
  args: {
    defaultChecked: true,
  },
}

export const Disabled: StoryObj<typeof Switch> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const Size: StoryObj<typeof Switch> = {
  name: 'size',
  render: (args) => (
    <Stack align="flex-start">
      {([undefined, 'S', 'M'] as const).map((size) => (
        <Switch {...args} key={String(size)} size={size} />
      ))}
    </Stack>
  ),
}
