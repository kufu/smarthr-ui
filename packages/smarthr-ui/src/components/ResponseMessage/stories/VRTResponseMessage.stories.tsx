import { Stack } from '../../Layout'
import { ResponseMessage } from '../ResponseMessage'

import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'

type ResponseMessageProps = ComponentProps<typeof ResponseMessage>

/*
type	size	iconGap
info	XXS	0.25
sync	XS	null
warning	XXS	0.5
error	XS	0.25
success	M	0.5
info	S	null
success	L	0.25
warning	XS	null
success	XL	null
error	L	0.5
info	XL	0.5
sync	XL	0.25
warning	XL	0.25
error	S	0.25
sync	XXS	null
error	XL	null
success	S	0.5
warning	S	0.5
sync	XXL	0.5
warning	M	null
sync	M	0.25
info	XS	0.5
success	XXL	null
info	M	0.5
info	XXL	0.25
error	XXL	0.25
error	M	0.25
info	L	null
sync	L	null
error	XXS	null
warning	L	0.5
success	XS	null
success	XXS	0.5
warning	XXL	0.25
sync	S	0.25
*/
const testCases: Array<Partial<ResponseMessageProps>> = [
  { icon: { type: 'info', gap: 0.25 }, size: 'XXS' },
  { icon: 'sync', size: 'XS' },
  { icon: { type: 'warning', gap: 0.5 }, size: 'XXS' },
  { icon: { type: 'error', gap: 0.25 }, size: 'XS' },
  { icon: { type: 'success', gap: 0.5 }, size: 'M' },
  { icon: 'info', size: 'S' },
  { icon: { type: 'success', gap: 0.25 }, size: 'L' },
  { icon: 'warning', size: 'XS' },
  { icon: 'success', size: 'XL' },
  { icon: { type: 'error', gap: 0.5 }, size: 'L' },
  { icon: { type: 'info', gap: 0.5 }, size: 'XL' },
  { icon: { type: 'sync', gap: 0.25 }, size: 'XL' },
  { icon: { type: 'warning', gap: 0.25 }, size: 'XL' },
  { icon: { type: 'error', gap: 0.25 }, size: 'S' },
  { icon: 'sync', size: 'XXS' },
  { icon: 'error', size: 'XL' },
  { icon: { type: 'success', gap: 0.5 }, size: 'S' },
  { icon: { type: 'warning', gap: 0.5 }, size: 'S' },
  { icon: { type: 'sync', gap: 0.5 }, size: 'XXL' },
  { icon: 'warning', size: 'M' },
  { icon: { type: 'sync', gap: 0.25 }, size: 'M' },
  { icon: { type: 'info', gap: 0.5 }, size: 'XS' },
  { icon: 'success', size: 'XXL' },
  { icon: { type: 'info', gap: 0.5 }, size: 'M' },
  { icon: { type: 'info', gap: 0.25 }, size: 'XXL' },
  { icon: { type: 'error', gap: 0.25 }, size: 'XXL' },
  { icon: { type: 'error', gap: 0.25 }, size: 'M' },
  { icon: 'info', size: 'L' },
  { icon: 'sync', size: 'L' },
  { icon: 'error', size: 'XXS' },
  { icon: { type: 'warning', gap: 0.5 }, size: 'L' },
  { icon: 'success', size: 'XS' },
  { icon: { type: 'success', gap: 0.5 }, size: 'XXS' },
  { icon: { type: 'warning', gap: 0.25 }, size: 'XXL' },
  { icon: { type: 'sync', gap: 0.25 }, size: 'S' },
]

export default {
  title: 'Components/ResponseMessage/VRT',
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
