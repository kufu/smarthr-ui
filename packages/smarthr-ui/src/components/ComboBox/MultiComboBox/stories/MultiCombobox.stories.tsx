/* eslint-disable smarthr/a11y-input-in-form-control */
import { useArgs } from '@storybook/preview-api'
import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Stack } from '../../../Layout'
import { MultiComboBox } from '../MultiComboBox'

// eslint-disable-next-line storybook/prefer-pascal-case
export const defaultItems = {
  'option 1': {
    label: 'option 1',
    value: 'value-1',
    data: {
      name: 'test',
      age: 23,
    },
  },
  'option 2': {
    label: 'option 2',
    value: 'value-2',
    data: {
      name: 'test 2',
      age: 34,
    },
  },
  'option 3': {
    label: 'option 3',
    value: 'value-3',
    disabled: true,
  },
  'option 4': {
    label: 'option 4',
    value: 'value-4',
  },
  'option 5': {
    label: 'option 5',
    value: 'value-5',
  },
  'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）': {
    label: 'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）',
    value: 'value-6',
  },
  アイテムのラベルがReactNodeの場合: {
    label: (
      <Stack as="span" gap={0.25}>
        <span>アイテムのラベルがReactNodeの場合</span>
        <span>（ダミーテキストダミーテキストダミーテキストダミーテキスト）</span>
      </Stack>
    ),
    value: 'value-7',
  },
}

export default {
  title: 'Forms（フォーム）/MultiComboBox',
  component: MultiComboBox,
  render: (args) => {
    const [_, setArgs] = useArgs()
    return (
      <MultiComboBox
        {...args}
        onDelete={(item) =>
          setArgs({
            selectedItems: args.selectedItems.filter(
              (selectedItem) => selectedItem.value !== item.value,
            ),
          })
        }
        onSelect={(item) =>
          setArgs({
            selectedItems: [...args.selectedItems, item],
          })
        }
      />
    )
  },
  args: {
    items: Object.values(defaultItems),
    selectedItems: [],
  },
  argTypes: {
    items: { control: 'object' },
    selectedItems: { control: 'object' },
  },
  parameters: {
    parameters: {
      chromatic: { disableSnapshot: true },
    },
  },
  excludeStories: ['defaultItems'],
} as Meta<typeof MultiComboBox<{ option: string }>>

export const Playground: StoryObj<typeof MultiComboBox> = {}

export const SelectedItems: StoryObj<typeof MultiComboBox> = {
  name: 'selectedItems',
  args: {
    selectedItems: [defaultItems['option 1'], defaultItems['option 4']],
  },
}

export const Disabled: StoryObj<typeof MultiComboBox> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const Error: StoryObj<typeof MultiComboBox> = {
  name: 'error',
  args: {
    error: true,
  },
}

export const Creatable: StoryObj<typeof MultiComboBox> = {
  name: 'creatable',
  args: {
    creatable: true,
    dropdownHelpMessage: '新しいアイテムを追加できます。',
  },
}

export const IsLoading: StoryObj<typeof MultiComboBox> = {
  name: 'isLoading',
  args: {
    isLoading: true,
  },
}

export const Width: StoryObj<typeof MultiComboBox> = {
  name: 'width',
  args: {
    width: '20rem',
  },
}

export const DropdownHelpMessage: StoryObj<typeof MultiComboBox> = {
  name: 'dropdownHelpMessage',
  args: {
    dropdownHelpMessage: 'ヘルプメッセージ',
  },
}

export const DropdownWidth: StoryObj<typeof MultiComboBox> = {
  name: 'dropdownWidth',
  args: {
    dropdownWidth: '30rem',
  },
}
