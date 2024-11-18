import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Switch } from '..'

export default {
  title: 'Forms（フォーム）/Switch',
  component: Switch,
  render: (args) => <Switch {...args} />,
  args: {
    children: 'ラベル',
  },
  argTypes: {
    dangerouslyLabelHidden: {
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
  tags: ['skip-test-runner'],
} as Meta<typeof Switch>

export const Playground: StoryObj<typeof Switch> = {}

export const DangerouslyLabelHidden: StoryObj<typeof Switch> = {
  name: 'dangerouslyLabelHidden',
  args: {
    dangerouslyLabelHidden: true,
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
