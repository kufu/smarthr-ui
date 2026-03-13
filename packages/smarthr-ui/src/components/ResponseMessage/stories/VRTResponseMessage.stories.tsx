import { pictParser } from '../../../libs/pictParser'
import { Stack } from '../../Layout'
import { ResponseMessage } from '../ResponseMessage'

import type { Meta, StoryObj } from '@storybook/react-webpack5'
import type { ComponentProps } from 'react'

type ResponseMessageProps = ComponentProps<typeof ResponseMessage>

const testCases = pictParser<Array<Partial<ResponseMessageProps>>>(
  `status	size
   info	XXS
   warning	L
   error	XXS
   success	XXS
   sync	XS
   success	XL
   error	XL
   error	S
   info	XS
   info	M
   sync	XL
   success	XXL
   success	M
   info	L
   warning	XXL
   sync	S
   sync	XXS
   success	XS
   warning	XXS
   error	XXL
   error	M
   warning	XL
   info	S
   info	XXL
   sync	M
   error	XS
   warning	M
   success	S
   success	L
   sync	L
   warning	XS
   sync	XXL
   error	L
   warning	S
   info	XL`,
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
