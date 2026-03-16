import { Stack } from '../../Layout'
import { Textarea } from '../Textarea'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Textarea/VRT',
  render: (args) => (
    <Stack>
      {[undefined, 'focus-visible'].map((id) => (
        <Stack id={id} key={id} align="flex-start">
          <Textarea {...args} disabled />
          <Textarea {...args} error />
          <Textarea {...args} width="20em" />
          <Textarea {...args} rows={3} />
          <Textarea {...args} maxLetters={5} />
          <Textarea {...args} maxLetters={5} value="テキスト" />
          <Textarea {...args} maxLetters={5} value="テキストエ" />
          <Textarea {...args} maxLetters={5} value="テキストエリア" />
        </Stack>
      ))}
    </Stack>
  ),
  parameters: {
    pseudo: {
      focusVisible: ['#focus-visible textarea'],
    },
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Textarea>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
