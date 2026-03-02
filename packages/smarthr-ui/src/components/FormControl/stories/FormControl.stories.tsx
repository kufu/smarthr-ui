import { MultiCombobox, SingleCombobox } from '../../Combobox'
import { DatePicker } from '../../DatePicker'
import { DropZone } from '../../DropZone'
import { FaAddressBookIcon } from '../../Icon'
import { CurrencyInput, Input } from '../../Input'
import { InputFile } from '../../InputFile'
import { Cluster, Stack } from '../../Layout'
import { MonthPicker, TimePicker } from '../../Picker'
import { Select } from '../../Select'
import { StatusLabel } from '../../StatusLabel'
import { STYLE_TYPE_MAP } from '../../Text'
import { Textarea } from '../../Textarea'
import { FormControl } from '../FormControl'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const _childrenOptions = {
  '<Input />': <Input name="formcontrol_input" />,
  '<DatePicker />': <DatePicker name="formcontrol_datepicker" />,
  '<CurrencyInput />': <CurrencyInput name="formcontrol_currencyinput" />,
  '<Textarea />': <Textarea name="formcontrol_textarea" />,
  '<Select />': <Select name="formcontrol_select" options={[]} hasBlank />,
  '<SingleCombobox />': (
    <SingleCombobox name="formcontrol_singlecombobox" items={[]} selectedItem={null} />
  ),
  '<MultiCombobox />': (
    <MultiCombobox name="formcontrol_multicombobox" items={[]} selectedItems={[]} />
  ),
  '<InputFile />': <InputFile name="formcontrol_inputfile" label="ファイルを選択" />,
  '<DropZone />': <DropZone name="formcontrol_dropzone" onSelectFiles={() => null} />,
}
const _errorMessages = {
  単一: 'エラーメッセージ',
  複数: ['エラーメッセージ1', 'エラーメッセージ2'],
}

export default {
  title: 'Components/FormControl',
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
    label: 'フォームコントロール',
    children: <Input name="formcontrol_input" />,
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

export const Label: StoryObj<typeof FormControl> = {
  name: 'label',
  args: {
    label: '入力要素に紐づく名前',
  },
}

export const LabelStyleType: StoryObj<typeof FormControl> = {
  name: 'label.styleType',
  render: (args) => (
    <Stack>
      {[undefined, ...Object.keys(STYLE_TYPE_MAP)].map((labelType) => (
        <FormControl
          {...args}
          label={
            labelType
              ? {
                  text: labelType,
                  styleType: labelType,
                }
              : 'undefined'
          }
          key={labelType}
        />
      ))}
    </Stack>
  ),
}

export const UnrecommendedTitleHidden: StoryObj<typeof FormControl> = {
  name: 'label.unrecommendedHide（利用注意）',
  args: {
    label: {
      text: 'フォームコントロール',
      unrecommendedHide: true,
    },
  },
}

export const HtmlFor: StoryObj<typeof FormControl> = {
  name: 'label.htmlFor',
  args: {
    label: {
      text: 'フォームコントロール',
      htmlFor: 'input-id',
    },
  },
}

export const LabelId: StoryObj<typeof FormControl> = {
  name: 'label.id',
  args: {
    label: {
      text: 'フォームコントロール',
      id: 'label-id',
    },
  },
}

export const LabelIcon: StoryObj<typeof FormControl> = {
  name: 'label.icon',
  args: {
    label: {
      text: 'フォームコントロール',
      icon: <FaAddressBookIcon />,
    },
  },
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
