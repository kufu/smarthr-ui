/* eslint-disable smarthr/a11y-input-in-form-control */
import { useArgs } from 'storybook/preview-api'
import { Meta, StoryObj } from '@storybook/react'

import { Stack } from '../../../Layout'
import { Text } from '../../../Text'
import { MultiCombobox } from '../MultiCombobox'

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
  title: 'Components/Combobox/MultiCombobox',
  component: MultiCombobox,
  render: (args) => {
    const [_, setArgs] = useArgs()
    return (
      <MultiCombobox
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
    dropdownHelpMessage: {
      control: { type: 'select' },
      options: ['文字列', 'ReactNode'],
      mapping: {
        文字列: 'ヘルプメッセージ',
        ReactNode: <Text className="shr-text-danger">React Nodeを渡したメッセージ</Text>,
      },
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  excludeStories: ['defaultItems'],
} as Meta<typeof MultiCombobox<{ option: string }>>

export const Playground: StoryObj<typeof MultiCombobox> = {}

export const SelectedItems: StoryObj<typeof MultiCombobox> = {
  name: 'selectedItems',
  args: {
    selectedItems: [defaultItems['option 1'], defaultItems['option 4']],
  },
}

export const Disabled: StoryObj<typeof MultiCombobox> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const Error: StoryObj<typeof MultiCombobox> = {
  name: 'error',
  args: {
    error: true,
  },
}

export const Creatable: StoryObj<typeof MultiCombobox> = {
  name: 'creatable',
  args: {
    creatable: true,
    dropdownHelpMessage: '新しいアイテムを追加できます。',
  },
}

export const IsLoading: StoryObj<typeof MultiCombobox> = {
  name: 'isLoading',
  args: {
    isLoading: true,
  },
}

export const Width: StoryObj<typeof MultiCombobox> = {
  name: 'width',
  args: {
    width: '20rem',
  },
}

export const DropdownHelpMessage: StoryObj<typeof MultiCombobox> = {
  name: 'dropdownHelpMessage',
  args: {
    dropdownHelpMessage: 'ヘルプメッセージ',
  },
}

export const DropdownWidth: StoryObj<typeof MultiCombobox> = {
  name: 'dropdownWidth',
  args: {
    dropdownWidth: '30rem',
  },
}
