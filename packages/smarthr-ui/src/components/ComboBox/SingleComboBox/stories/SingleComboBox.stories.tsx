import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { FormControl } from '../../../FormControl'
import { FaCirclePlusIcon } from '../../../Icon'
import { Stack } from '../../../Layout'
import { SingleComboBox } from '../SingleComboBox'

const defaultItems = {
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
const prefixes = { なし: '', あり: <FaCirclePlusIcon /> }

export default {
  title: 'Forms（フォーム）/SingleComboBox',
  component: SingleComboBox,
  args: {
    items: Object.values(defaultItems),
    selectedItem: null,
    defaultItem: defaultItems['option 1'],
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
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SingleComboBox>

export const Playground: StoryObj<typeof SingleComboBox> = {}

export const SelectedItem: StoryObj<typeof SingleComboBox> = {
  name: 'selectedItem',
  args: {
    selectedItem: defaultItems['option 2'],
  },
}

export const DefaultItem: StoryObj<typeof SingleComboBox> = {
  name: 'defaultItem',
  args: {
    defaultItem: defaultItems['option 4'],
  },
}

export const Prefix: StoryObj<typeof SingleComboBox> = {
  name: 'prefix',
  render: (args) => (
    <form>
      <Stack gap={1}>
        <FormControl title="prefixなし" dangerouslyTitleHidden>
          <SingleComboBox {...args} prefix={prefixes['なし']} />
        </FormControl>
        <FormControl title="prefixあり" dangerouslyTitleHidden>
          <SingleComboBox {...args} prefix={prefixes['あり']} />
        </FormControl>
      </Stack>
    </form>
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
    width: '500px',
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
    dropdownWidth: '300px',
  },
}
