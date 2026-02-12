import { RadioButton } from '../RadioButton'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/RadioButton',
  component: RadioButton,
  render: (args) => <RadioButton {...args} />,
  args: {
    children: 'ラジオボタン',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof RadioButton>

export const Playground: StoryObj<typeof RadioButton> = {
  args: {},
}

export const Checked: StoryObj<typeof RadioButton> = {
  name: 'checked',
  args: {
    checked: true,
  },
}

export const Disabled: StoryObj<typeof RadioButton> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}
