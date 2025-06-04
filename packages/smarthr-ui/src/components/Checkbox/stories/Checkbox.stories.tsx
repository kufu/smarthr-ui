import { Checkbox } from '../Checkbox'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  render: (args) => <Checkbox {...args}>Checkbox</Checkbox>,
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Checkbox>

export const Playground: StoryObj<typeof Checkbox> = {
  args: {},
}

export const Checked: StoryObj<typeof Checkbox> = {
  name: 'checked',
  args: {
    checked: true,
  },
}

export const Disabled: StoryObj<typeof Checkbox> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const Mixed: StoryObj<typeof Checkbox> = {
  name: 'mixed',
  args: {
    checked: true,
    mixed: true,
  },
}

export const Error: StoryObj<typeof Checkbox> = {
  name: 'error',
  args: {
    error: true,
  },
}
