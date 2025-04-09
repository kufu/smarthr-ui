import React from 'react'

import { Stack } from '../../Layout'
import { ResponseMessage } from '../ResponseMessage'

import { Type, Size, Right, IconGap } from './ResponseMessage.stories'

import type { Meta } from '@storybook/react'

export default {
  title: 'Text（テキスト）/ResponseMessage/VRT',
  render: (args, context) => (
    <Stack>
      {Type.render?.(args, context)}
      {Size.render?.(args, context)}
      {Right.render?.(args, context)}
      {IconGap.render?.(args, context)}
    </Stack>
  ),
  args: {
    children:
      'レスポンスメッセージレスポンスメッセージレスポンスメッセージレスポンスメッセージレスポンスメッセージレスポンスメッセージレスポンスメッセージレスポンスメッセージレスポンスメッセージレスポンスメッセージレスポンスメッセージ',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ResponseMessage>

export const VRT = {}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
