import { StatusLabel } from '../../StatusLabel'
import { RadioButtonPanel } from '../RadioButtonPanel'

import type { Meta, StoryObj } from '@storybook/react'

const _asOptions = { なし: undefined, '<span>': 'span', '<p>': 'p' }

export default {
  title: 'Components/RadioButtonPanel',
  component: RadioButtonPanel,
  render: (args) => <RadioButtonPanel {...args} />,
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    as: {
      control: 'radio',
      options: Object.keys(_asOptions),
      mapping: _asOptions,
    },
    children: {
      control: 'text',
    },
  },
  args: {
    label: 'ラジオボタンパネル',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof RadioButtonPanel>

export const Playground: StoryObj<typeof RadioButtonPanel> = {
  args: {},
}

export const Checked: StoryObj<typeof RadioButtonPanel> = {
  name: 'checked',
  args: {
    checked: true,
  },
}

export const Disabled: StoryObj<typeof RadioButtonPanel> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const As: StoryObj<typeof RadioButtonPanel> = {
  name: 'as',
  args: {
    as: 'span',
  },
}

export const Children: StoryObj<typeof RadioButtonPanel> = {
  name: 'children',
  args: {
    children: '説明のテキストです。',
  },
}

export const LabelSuffix: StoryObj<typeof RadioButtonPanel> = {
  name: 'labelSuffix',
  args: {
    labelSuffix: <StatusLabel>ステータスラベル</StatusLabel>,
  },
}
