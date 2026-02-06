import { Switch } from '..'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

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
