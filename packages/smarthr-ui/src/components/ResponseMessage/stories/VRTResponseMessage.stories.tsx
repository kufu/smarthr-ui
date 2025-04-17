import { Stack } from '../../Layout'
import { ResponseMessage } from '../ResponseMessage'

import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'

type ResponseMessageProps = ComponentProps<typeof ResponseMessage>

/* 
PICTで生成した組み合わせテストケース

type	size	right	iconGap
info	XXS	false	0.25
success	XS	true	0.5
warning	S	false	0.5
error	M	true	0.25
sync	L	false	0.5
info	XL	true	0.25
success	XXL	false	0.5
warning	XXS	true	0.25
error	XS	false	0.5
sync	S	true	0.25
info	M	false	0.5
success	L	true	0.25
warning	XL	false	0.5
error	XXL	true	0.25
sync	XXS	false	0.5
*/

const testCases: Array<Partial<ResponseMessageProps>> = [
  { type: 'info', size: 'XXS', right: false, iconGap: 0.25 },
  { type: 'success', size: 'XS', right: true, iconGap: 0.5 },
  { type: 'warning', size: 'S', right: false, iconGap: 0.5 },
  { type: 'error', size: 'M', right: true, iconGap: 0.25 },
  { type: 'sync', size: 'L', right: false, iconGap: 0.5 },
  { type: 'info', size: 'XL', right: true, iconGap: 0.25 },
  { type: 'success', size: 'XXL', right: false, iconGap: 0.5 },
  { type: 'warning', size: 'XXS', right: true, iconGap: 0.25 },
  { type: 'error', size: 'XS', right: false, iconGap: 0.5 },
  { type: 'sync', size: 'S', right: true, iconGap: 0.25 },
  { type: 'info', size: 'M', right: false, iconGap: 0.5 },
  { type: 'success', size: 'L', right: true, iconGap: 0.25 },
  { type: 'warning', size: 'XL', right: false, iconGap: 0.5 },
  { type: 'error', size: 'XXL', right: true, iconGap: 0.25 },
  { type: 'sync', size: 'XXS', right: false, iconGap: 0.5 },
]

export default {
  title: 'Text（テキスト）/ResponseMessage/VRT',
  component: ResponseMessage,
  args: {
    children: 'レスポンスメッセージレスポンスメッセージレスポンスメッセージ',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ResponseMessage>

export const VRT: StoryObj<typeof ResponseMessage> = {
  render: (args: ResponseMessageProps) => (
    <Stack align="flex-start">
      {testCases.map((testCase, index) => (
        <ResponseMessage key={index} {...args} {...testCase} />
      ))}
    </Stack>
  ),
}

export const VRTForcedColors: StoryObj<typeof ResponseMessage> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
