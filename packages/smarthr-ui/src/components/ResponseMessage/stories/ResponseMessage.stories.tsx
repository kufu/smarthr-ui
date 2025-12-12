import { Stack } from '../../Layout'
import { ResponseMessage, classNameGenerator } from '../ResponseMessage'
import type { Meta, StoryObj } from '@storybook/react'

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
    icon: {
      type: 'info',
      gap: 0.25,
    },
    alt: '',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ResponseMessage>

export const Playground: StoryObj<typeof ResponseMessage> = {}

export const IconType: StoryObj<typeof ResponseMessage> = {
  name: 'icon.type',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, ...Object.keys(classNameGenerator.variants.type)].map((type) => (
        <ResponseMessage
          {...args}
          key={type}
          icon={{
            ...args.icon,
            type: type as any,
          }}
        />
      ))}
    </Stack>
  ),
}

export const Size: StoryObj<typeof ResponseMessage> = {
  name: 'size',
  render: (args) => (
    <Stack align="flex-start">
      {([undefined, 'M', 'S', 'XS'] as const).map((size) => (
        <ResponseMessage {...args} size={size}>
          {size || 'size未指定はMと同サイズ'}
        </ResponseMessage>
      ))}
    </Stack>
  ),
}

export const IconGap: StoryObj<typeof ResponseMessage> = {
  name: 'icon.gap',
  render: (args) => (
    <Stack align="flex-start">
      <ResponseMessage {...args} icon={{ ...args.icon, gap: 0.25 }} />
      <ResponseMessage {...args} icon={{ ...args.icon, gap: 0.5 }} />
    </Stack>
  ),
}
