import { FormControl } from '../../FormControl'
import { Input } from '../../Input'
import { Cluster, Stack } from '../../Layout'
import { RadioButton } from '../../RadioButton'
import { StatusLabel } from '../../StatusLabel'
import { STYLE_TYPE_MAP } from '../../Text'
import { Fieldset } from '../Fieldset'

import type { Meta, StoryObj } from '@storybook/react'

export const _childrenOptions = {
  radio: (
    <Cluster gap={1.25}>
      <RadioButton name="radio">あり</RadioButton>
      <RadioButton name="radio">なし</RadioButton>
    </Cluster>
  ),
  form: (
    <Cluster gap={1}>
      <FormControl title="姓" titleType="subBlockTitle">
        <Input name="lastName" />
      </FormControl>
      <FormControl title="名" titleType="subBlockTitle">
        <Input name="firstName" />
      </FormControl>
    </Cluster>
  ),
}

export default {
  title: 'Components/Fieldset',
  component: Fieldset,
  render: (args) => <Fieldset {...args} />,
  argTypes: {
    children: {
      control: 'radio',
      options: Object.keys(_childrenOptions),
      mapping: _childrenOptions,
    },
    disabled: { control: 'boolean' },
  },
  args: {
    title: 'フィールドセットタイトル',
    children: _childrenOptions.radio,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  excludeStories: ['_childrenOptions'],
} satisfies Meta<typeof Fieldset>

export const Default: StoryObj<typeof Fieldset> = {
  args: {
    helpMessage: 'フィールドセットの補足となるヘルプメッセージを入れます。',
    exampleMessage: '入力欄に入れる入力例',
    errorMessages: '入力されていません',
    supplementaryMessage: '補足メッセージがあればここに入れます。',
  },
}

export const Playground: StoryObj<typeof Fieldset> = {
  args: {},
}

export const Title: StoryObj<typeof Fieldset> = {
  name: 'title',
  args: {
    title: '入力要素に紐づく名前',
  },
}

export const TitleType: StoryObj<typeof Fieldset> = {
  name: 'titleType',
  render: (args) => (
    <Stack>
      {[undefined, ...Object.keys(STYLE_TYPE_MAP)].map((titleType) => (
        <Fieldset
          {...args}
          title={titleType ?? 'undefined'}
          titleType={titleType as any}
          key={titleType}
        />
      ))}
    </Stack>
  ),
}

export const SubActionArea: StoryObj<typeof Fieldset> = {
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

export const DangerouslyTitleHidden: StoryObj<typeof Fieldset> = {
  name: 'dangerouslyTitleHidden（非推奨）',
  args: {
    dangerouslyTitleHidden: true,
  },
}

export const HtmlFor: StoryObj<typeof Fieldset> = {
  name: 'htmlFor',
  args: {
    htmlFor: 'input-id',
  },
}

export const LabelId: StoryObj<typeof Fieldset> = {
  name: 'labelId',
  args: {
    labelId: 'label-id',
  },
}

export const InnerMargin: StoryObj<typeof Fieldset> = {
  name: 'innerMargin',
  args: {
    innerMargin: 0.75,
  },
}

export const StatusLabels: StoryObj<typeof Fieldset> = {
  name: 'statusLabels',
  args: {
    statusLabels: <StatusLabel type="grey">任意</StatusLabel>,
  },
}

export const HelpMessage: StoryObj<typeof Fieldset> = {
  name: 'helpMessage',
  args: {
    helpMessage: '入力要素に紐づくヘルプメッセージ',
  },
}

export const ExampleMessage: StoryObj<typeof Fieldset> = {
  name: 'exampleMessage',
  args: {
    exampleMessage: '入力要素に紐づく入力例',
  },
}

export const ErrorMessages: StoryObj<typeof Fieldset> = {
  name: 'errorMessages',
  args: {
    errorMessages: '入力要素に紐づくエラーメッセージ',
  },
}

export const AutoBindErrorInput: StoryObj<typeof Fieldset> = {
  name: 'autoBindErrorInput',
  args: {
    autoBindErrorInput: false,
    errorMessages: '入力要素に紐づくエラーメッセージ',
  },
}

export const SupplementaryMessage: StoryObj<typeof Fieldset> = {
  name: 'supplementaryMessage',
  args: {
    supplementaryMessage: '入力要素に紐づく補足メッセージ',
  },
}

export const Disabled: StoryObj<typeof Fieldset> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}
