import { useState } from 'react'
import { action } from 'storybook/actions'

import { Browser } from '../Browser'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Browser',
  component: Browser,
  render: ({ value, onSelectItem, ...rest }) => {
    const [selectedValue, setSelectedValue] = useState<string | undefined>(value)
    return (
      <Browser
        {...rest}
        value={value ?? selectedValue}
        onSelectItem={onSelectItem ?? setSelectedValue}
      />
    )
  },
  args: {
    items: [
      {
        label: '親項目',
        value: 'parent1',
        children: [
          {
            value: 'child1',
            label: '子項目1',
            children: [{ value: 'grandchild1', label: '孫項目1' }],
          },
          { value: 'child2', label: '子項目2' },
        ],
      },
    ],
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Browser>

export const Playground: StoryObj<typeof Browser> = {}

export const Items: StoryObj<typeof Browser> = {
  name: 'items',
  args: {
    items: [
      {
        label: '親項目',
        value: 'parent1',
        children: [
          { value: 'child1', label: '子項目1' },
          { value: 'child2', label: '子項目2' },
        ],
      },
    ],
  },
}

export const OnSelectItem: StoryObj<typeof Browser> = {
  name: 'onSelectItem',
  args: {
    onSelectItem: action('onSelectItem'),
  },
}

export const Value: StoryObj<typeof Browser> = {
  name: 'value',
  args: {
    value: 'grandchild1',
  },
}
