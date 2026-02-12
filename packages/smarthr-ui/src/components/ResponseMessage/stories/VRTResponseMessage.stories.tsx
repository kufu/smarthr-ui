import { pictParser } from '../../../libs/pictParser'
import { Stack } from '../../Layout'
import { ResponseMessage } from '../ResponseMessage'

import type { Meta, StoryObj } from '@storybook/react-webpack5'
import type { ComponentProps } from 'react'

type ResponseMessageProps = ComponentProps<typeof ResponseMessage>

const testCases = pictParser<Array<Partial<ResponseMessageProps>>>(
  `type	size	iconGap
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
   sync	S	0.25`,
  ({ type, size, iconGap }) => ({ icon: { type, gap: iconGap }, size }),
)

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
        <ResponseMessage {...testCase} {...args} key={index} />
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
