/* eslint-disable smarthr/a11y-input-in-form-control */
import { useArgs } from '@storybook/preview-api'
import { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { backgroundColor } from '../../../../themes'

import { FaCirclePlusIcon } from '../../../Icon'
import { Stack } from '../../../Layout'
import { Text } from '../../../Text'
import { SingleCombobox } from '../SingleCombobox'

export const defaultItems = {
  'option 1': {
    label: 'option 1',
    value: 'value-1',
    data: {
      option: 'option 1',
    },
  },
  'option 2': {
    label: 'option 2',
    value: 'value-2',
    data: {
      option: 'option 2',
    },
  },
  'option 3': {
    label: 'option 3',
    value: 'value-3',
    disabled: true,
    data: {
      option: 'option 3',
    },
  },
  'option 4': {
    label: 'option 4',
    value: 'value-4',
    data: {
      option: 'option 4',
    },
  },
  'option 5': {
    label: 'option 5',
    value: 'value-5',
    data: {
      option: 'option 5',
    },
  },
  'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）': {
    label: 'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）',
    value: 'value-6',
    data: {
      option:
        'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）',
    },
  },
  アイテムのラベルがReactNodeの場合: {
    label: (
      <Stack as="span" gap={0.25}>
        <span>アイテムのラベルがReactNodeの場合</span>
        <span>（ダミーテキストダミーテキストダミーテキストダミーテキスト）</span>
      </Stack>
    ),
    value: 'value-7',
    data: {
      option: 'アイテムのラベルがReactNodeの場合',
    },
  },
}

export const prefixes = { なし: '', あり: <FaCirclePlusIcon /> }

export default {
  title: 'Forms（フォーム）/SingleCombobox',
  component: SingleCombobox,
  render: (args) => {
    const [, setArgs] = useArgs()
    return (
      <SingleCombobox
        {...args}
        onClearClick={() => setArgs({ selectedItem: null })}
        onSelect={(item) => setArgs({ selectedItem: item.data?.option })}
      />
    )
  },
  args: {
    items: Object.values(defaultItems),
    selectedItem: null,
  },
  argTypes: {
    items: { control: 'object' },
    readOnly: {
      control: { type: 'boolean' },
    },
    selectedItem: {
      control: { type: 'select' },
      options: Object.keys(defaultItems),
      mapping: defaultItems,
    },
    defaultItem: {
      control: { type: 'select' },
      options: Object.keys(defaultItems),
      mapping: defaultItems,
    },
    prefix: {
      control: 'radio',
      options: Object.keys(prefixes),
      mapping: prefixes,
    },
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
  excludeStories: ['defaultItems', 'prefixes'],
} as Meta<typeof SingleCombobox<{ option: string }>>

export const Playground: StoryObj<typeof SingleCombobox> = {}

export const SelectedItem: StoryObj<typeof SingleCombobox> = {
  name: 'selectedItem',
  args: {
    selectedItem: defaultItems['option 2'],
  },
}

export const DefaultItem: StoryObj<typeof SingleCombobox> = {
  name: 'defaultItem',
  render: (args) => {
    const [selectItem, setSelectItem] = useState(args.defaultItem)
    return (
      <SingleCombobox
        {...args}
        selectedItem={selectItem ?? null}
        onSelect={(item) => setSelectItem(item)}
      />
    )
  },
  args: {
    defaultItem: defaultItems['option 4'],
  },
}

export const Prefix: StoryObj<typeof SingleCombobox> = {
  name: 'prefix',
  render: (args) => (
    <Stack gap={1}>
      <SingleCombobox {...args} prefix={prefixes['なし']} />
      <SingleCombobox {...args} prefix={prefixes['あり']} />
    </Stack>
  ),
}

export const Disabled: StoryObj<typeof SingleCombobox> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const ReadOnly: StoryObj<typeof SingleCombobox> = {
  name: 'readOnly',
  args: {
    readOnly: true,
  },
  parameters: {
    backgrounds: { values: [{ name: 'light', value: backgroundColor.white }] },
  },
}

export const Error: StoryObj<typeof SingleCombobox> = {
  name: 'error',
  args: {
    error: true,
  },
}

export const Creatable: StoryObj<typeof SingleCombobox> = {
  name: 'creatable',
  args: {
    creatable: true,
    dropdownHelpMessage: '新しいアイテムを追加できます。',
  },
}

export const IsLoading: StoryObj<typeof SingleCombobox> = {
  name: 'isLoading',
  args: {
    isLoading: true,
  },
}

export const Width: StoryObj<typeof SingleCombobox> = {
  name: 'width',
  args: {
    width: '20rem',
  },
}

export const DropdownHelpMessage: StoryObj<typeof SingleCombobox> = {
  name: 'dropdownHelpMessage',
  args: {
    dropdownHelpMessage: 'ヘルプメッセージ',
  },
}

export const DropdownWidth: StoryObj<typeof SingleCombobox> = {
  name: 'dropdownWidth',
  args: {
    dropdownWidth: '30rem',
  },
}
