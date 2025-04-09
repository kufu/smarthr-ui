import { Stack } from '../../Layout'

import { ResponseMessage, classNameGenerator } from '../ResponseMessage'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Text（テキスト）/ResponseMessage',
  component: ResponseMessage,
  render: (args) => <ResponseMessage {...args} />,
  args: {
    children: 'レスポンスメッセージ',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ResponseMessage>

export const Playground: StoryObj<typeof ResponseMessage> = {
  args: {},
}

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
  name: 'size',
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
  render: (args) => (
    <Stack align="flex-start">
      <ResponseMessage {...args} />
      <ResponseMessage {...args} right />
    </Stack>
  ),
}

export const IconGap: StoryObj<typeof ResponseMessage> = {
  name: 'iconGap',
  render: (args) => (
    <Stack align="flex-start">
      <ResponseMessage {...args} iconGap={0.25} />
      <ResponseMessage {...args} iconGap={0.5} />
      <ResponseMessage {...args} iconGap={1} />
      <ResponseMessage {...args} iconGap={2} />
    </Stack>
  ),
}
