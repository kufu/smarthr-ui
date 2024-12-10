/* eslint-disable smarthr/a11y-input-in-form-control */
import { useArgs } from '@storybook/preview-api'
import { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { FaCirclePlusIcon } from '../../../Icon'
import { Stack } from '../../../Layout'
import { Text } from '../../../Text'
import { SingleComboBox } from '../SingleComboBox'

// eslint-disable-next-line storybook/prefer-pascal-case
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

// eslint-disable-next-line storybook/prefer-pascal-case
export const prefixes = { なし: '', あり: <FaCirclePlusIcon /> }

export default {
  title: 'Forms（フォーム）/SingleComboBox',
  component: SingleComboBox,
  render: (args) => {
    const [, setArgs] = useArgs()
    return (
      <SingleComboBox
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
} as Meta<typeof SingleComboBox<{ option: string }>>

export const Playground: StoryObj<typeof SingleComboBox> = {}

export const SelectedItem: StoryObj<typeof SingleComboBox> = {
  name: 'selectedItem',
  args: {
    selectedItem: defaultItems['option 2'],
  },
}

export const DefaultItem: StoryObj<typeof SingleComboBox> = {
  name: 'defaultItem',
  render: (args) => {
    const [selectItem, setSelectItem] = useState(args.defaultItem)
    return (
      <SingleComboBox
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

export const Prefix: StoryObj<typeof SingleComboBox> = {
  name: 'prefix',
  render: (args) => (
    <Stack gap={1}>
      <SingleComboBox {...args} prefix={prefixes['なし']} />
      <SingleComboBox {...args} prefix={prefixes['あり']} />
    </Stack>
  ),
}

export const Disabled: StoryObj<typeof SingleComboBox> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const Error: StoryObj<typeof SingleComboBox> = {
  name: 'error',
  args: {
    error: true,
  },
}

export const Creatable: StoryObj<typeof SingleComboBox> = {
  name: 'creatable',
  args: {
    creatable: true,
    dropdownHelpMessage: '新しいアイテムを追加できます。',
  },
}

export const IsLoading: StoryObj<typeof SingleComboBox> = {
  name: 'isLoading',
  args: {
    isLoading: true,
  },
}

export const Width: StoryObj<typeof SingleComboBox> = {
  name: 'width',
  args: {
    width: '20rem',
  },
}

export const DropdownHelpMessage: StoryObj<typeof SingleComboBox> = {
  name: 'dropdownHelpMessage',
  args: {
    dropdownHelpMessage: 'ヘルプメッセージ',
  },
}

export const DropdownWidth: StoryObj<typeof SingleComboBox> = {
  name: 'dropdownWidth',
  args: {
    dropdownWidth: '30rem',
  },
}
