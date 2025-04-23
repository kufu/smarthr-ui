/* eslint-disable smarthr/a11y-input-in-form-control */
/* eslint-disable smarthr/a11y-input-has-name-attribute */
import { MultiCombobox, SingleCombobox } from '../../Combobox'
import { DatePicker } from '../../DatePicker'
import { DropZone } from '../../DropZone'
import { CurrencyInput, Input } from '../../Input'
import { InputFile } from '../../InputFile'
import { Cluster, Stack } from '../../Layout'
import { MonthPicker, TimePicker } from '../../Picker'
import { Select } from '../../Select'
import { StatusLabel } from '../../StatusLabel'
import { STYLE_TYPE_MAP } from '../../Text'
import { Textarea } from '../../Textarea'
import { FormControl } from '../FormControl'

import type { Meta, StoryObj } from '@storybook/react'

const _childrenOptions = {
  '<Input />': <Input />,
  '<DatePicker />': <DatePicker />,
  '<TimePicker />': <TimePicker />,
  '<MonthPicker />': <MonthPicker />,
  '<CurrencyInput />': <CurrencyInput />,
  '<Textarea />': <Textarea />,
  '<Select />': <Select options={[]} hasBlank />,
  '<SingleCombobox />': <SingleCombobox items={[]} selectedItem={null} />,
  '<MultiCombobox />': <MultiCombobox items={[]} selectedItems={[]} />,
  '<InputFile />': <InputFile label="ファイルを選択" />,
  '<DropZone />': <DropZone onSelectFiles={() => null} />,
}
const _errorMessages = {
  単一: 'エラーメッセージ',
  複数: ['エラーメッセージ1', 'エラーメッセージ2'],
}

export default {
  title: 'Forms（フォーム）/FormControl',
  component: FormControl,
  render: (args) => <FormControl {...args} />,
  argTypes: {
    children: {
      options: Object.keys(_childrenOptions),
      mapping: _childrenOptions,
    },
    helpMessage: { control: 'text' },
    exampleMessage: { control: 'text' },
    errorMessages: {
      control: 'radio',
      options: Object.keys(_errorMessages),
      mapping: _errorMessages,
    },
    supplementaryMessage: { control: 'text' },
  },
  args: {
    title: 'フォームコントロール',

    children: <Input />,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof FormControl>

export const Default: StoryObj<typeof FormControl> = {
  args: {
    helpMessage: 'フォームコントロールの補足となるヘルプメッセージを入れます。',
    exampleMessage: '入力欄に入れる入力例',
    errorMessages: '入力されていません',
    supplementaryMessage: '補足メッセージがあればここに入れます。',
  },
}

export const Playground: StoryObj<typeof FormControl> = {
  args: {},
}

export const Title: StoryObj<typeof FormControl> = {
  name: 'title',
  args: {
    title: '入力要素に紐づく名前',
  },
}

export const TitleType: StoryObj<typeof FormControl> = {
  name: 'titleType',
  render: (args) => (
    <Stack>
      {[undefined, ...Object.keys(STYLE_TYPE_MAP)].map((titleType) => (
        <FormControl
          {...args}
          title={titleType ?? 'undefined'}
          titleType={titleType as any}
          key={titleType}
        />
      ))}
    </Stack>
  ),
}

export const SubActionArea: StoryObj<typeof FormControl> = {
  name: 'subActionArea',
  args: {
    subActionArea: (
      <Cluster justify="space-between">
        <div>サブアクションエリア（start)</div>
        <div>サブアクションエリア（end)</div>
      </Cluster>
    ),
  },
}

export const DangerouslyTitleHidden: StoryObj<typeof FormControl> = {
  name: 'dangerouslyTitleHidden（利用注意）',
  args: {
    dangerouslyTitleHidden: true,
  },
}

export const HtmlFor: StoryObj<typeof FormControl> = {
  name: 'htmlFor',
  args: {
    htmlFor: 'input-id',
  },
}

export const LabelId: StoryObj<typeof FormControl> = {
  name: 'labelId',
  args: {
    labelId: 'label-id',
  },
}

export const InnerMargin: StoryObj<typeof FormControl> = {
  name: 'innerMargin',
  args: {
    innerMargin: 1,
  },
}

export const StatusLabels: StoryObj<typeof FormControl> = {
  name: 'statusLabels',
  args: {
    statusLabels: <StatusLabel type="grey">任意</StatusLabel>,
  },
}

export const HelpMessage: StoryObj<typeof FormControl> = {
  name: 'helpMessage',
  args: {
    helpMessage: '入力要素に紐づくヘルプメッセージ',
  },
}

export const ExampleMessage: StoryObj<typeof FormControl> = {
  name: 'exampleMessage',
  args: {
    exampleMessage: '入力要素に紐づく入力例',
  },
}

export const ErrorMessages: StoryObj<typeof FormControl> = {
  name: 'errorMessages',
  args: {
    errorMessages: '入力要素に紐づくエラーメッセージ',
  },
}

export const AutoBindErrorInput: StoryObj<typeof FormControl> = {
  name: 'autoBindErrorInput',
  args: {
    autoBindErrorInput: false,
    errorMessages: '入力要素に紐づくエラーメッセージ',
  },
}

export const SupplementaryMessage: StoryObj<typeof FormControl> = {
  name: 'supplementaryMessage',
  args: {
    supplementaryMessage: '入力要素に紐づく補足メッセージ',
  },
}
