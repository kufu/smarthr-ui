import { action } from '@storybook/addon-actions'
import React from 'react'

import { Stack } from '../../Layout'
import { FlashMessage, messageTypes } from '../FlashMessage'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'States（状態）/FlashMessage（非推奨）',
  component: FlashMessage,
  render: (args) => <FlashMessage {...args} />,
  args: {
    visible: true,
    type: 'success',
    text: '成功しました',
    onClose: action('close'),
    // Story 上で左上に表示するための記述です
    className: 'shr-sticky shr-inline-flex',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof FlashMessage>

export const Playground: StoryObj<typeof FlashMessage> = {
  args: {
    visible: true,
  },
}

export const Visible: StoryObj<typeof FlashMessage> = {
  name: 'visible',
  args: { visible: true },
}

export const Type: StoryObj<typeof FlashMessage> = {
  name: 'type',
  render: (args) => (
    <Stack align="flex-start">
      {messageTypes.map((type) => (
        <FlashMessage {...args} type={type} text={`${type} メッセージ`} key={type} />
      ))}
    </Stack>
  ),
}

export const Text: StoryObj<typeof FlashMessage> = {
  name: 'text',
  args: { text: 'メッセージ' },
}

export const Role: StoryObj<typeof FlashMessage> = {
  name: 'role',
  args: { role: 'status' },
}

export const AutoClose: StoryObj<typeof FlashMessage> = {
  name: 'autoClose',
  args: { autoClose: false },
}

export const Animation: StoryObj<typeof FlashMessage> = {
  name: 'animation',
  render: (args) => (
    <Stack align="flex-start">
      <FlashMessage {...args} animation="bounce" text="bounce" />
      <FlashMessage {...args} animation="none" text="none" />
    </Stack>
  ),
}
