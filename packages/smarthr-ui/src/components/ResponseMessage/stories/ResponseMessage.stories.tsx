import { Stack } from '../../Layout'
import { ResponseMessage, classNameGenerator } from '../ResponseMessage'
import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Text（テキスト）/ResponseMessage',
  component: ResponseMessage,
  render: (args) => <ResponseMessage {...args} />,
  argTypes: {
    alt: { control: 'text' },
    type: {
      control: 'select',
      options: Object.keys(classNameGenerator.variants.type),
    },
    color: { table: { disable: true } },
  },
  args: {
    children: 'レスポンスメッセージ',
    type: 'info',
    size: 'M',
    alt: '',
    right: false,
    iconGap: 0.25,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ResponseMessage>

export const Playground: StoryObj<typeof ResponseMessage> = {}

export const Type: StoryObj<typeof ResponseMessage> = {
  name: 'type',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, ...Object.keys(classNameGenerator.variants.type)].map((type) => (
        <ResponseMessage {...args} type={type as any} key={type} />
      ))}
    </Stack>
  ),
}

export const Size: StoryObj<typeof ResponseMessage> = {
  name: 'size（非推奨）',
  render: (args) => (
    <Stack align="flex-start">
      <ResponseMessage {...args} size="XXS" />
      <ResponseMessage {...args} size="XS" />
      <ResponseMessage {...args} size="S" />
      <ResponseMessage {...args} size="M" />
      <ResponseMessage {...args} size="L" />
      <ResponseMessage {...args} size="XL" />
      <ResponseMessage {...args} size="XXL" />
    </Stack>
  ),
}

export const Right: StoryObj<typeof ResponseMessage> = {
  name: 'right',
  render: (args) => <ResponseMessage {...args} right />,
}

export const IconGap: StoryObj<typeof ResponseMessage> = {
  name: 'iconGap',
  render: (args) => (
    <Stack align="flex-start">
      <ResponseMessage {...args} iconGap={0.25} />
      <ResponseMessage {...args} iconGap={0.5} />
    </Stack>
  ),
}
