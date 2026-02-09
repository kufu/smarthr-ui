import { Stack } from '../../Layout'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/VisuallyHiddenText/VRT',
  component: VisuallyHiddenText,
  render: () => (
    <Stack>
      <VisuallyHiddenText>デフォルト（span）</VisuallyHiddenText>
      <VisuallyHiddenText as="p">p要素での表示</VisuallyHiddenText>
      <VisuallyHiddenText as="div">div要素での表示</VisuallyHiddenText>
      <VisuallyHiddenText as="h1">h1要素での表示</VisuallyHiddenText>
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof VisuallyHiddenText>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
