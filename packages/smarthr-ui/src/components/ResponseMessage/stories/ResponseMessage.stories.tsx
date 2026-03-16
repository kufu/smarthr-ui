import { Stack } from '../../Layout'
import { ResponseMessage, classNameGenerator } from '../ResponseMessage'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/ResponseMessage',
  component: ResponseMessage,
  render: (args) => <ResponseMessage {...args} />,
  argTypes: {
    alt: { control: 'text' },
    type: {
      control: 'select',
      options: Object.keys(classNameGenerator.variants.type),
    },
    size: { name: 'size' },
    color: { table: { disable: true } },
  },
  args: {
    children: 'レスポンスメッセージ',
    type: 'info',
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
  name: 'size',
  render: (args) => (
    <Stack align="flex-start">
      {([undefined, 'M', 'S', 'XS'] as const).map((size) => (
        <ResponseMessage {...args} key={size || 'undefined'} size={size}>
          {size || 'size未指定はMと同サイズ'}
        </ResponseMessage>
      ))}
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
