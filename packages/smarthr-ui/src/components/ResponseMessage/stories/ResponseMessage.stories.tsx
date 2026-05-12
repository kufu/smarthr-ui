import { Stack } from '../../Layout'
import { ResponseMessage } from '../ResponseMessage'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/ResponseMessage',
  component: ResponseMessage,
  render: (args) => <ResponseMessage {...args} />,
  argTypes: {
    alt: { control: 'text' },
    status: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error', 'sync'],
    },
    size: { name: 'size' },
    color: { table: { disable: true } },
  },
  args: {
    children: 'レスポンスメッセージ',
    status: 'info',
    alt: '',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ResponseMessage>

export const Playground: StoryObj<typeof ResponseMessage> = {}

export const Status: StoryObj<typeof ResponseMessage> = {
  name: 'status',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, 'info', 'success', 'warning', 'error', 'sync'].map((status) => (
        <ResponseMessage {...args} status={status as any} key={status} />
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
