import { Stack } from '../../Layout'
import { Textarea } from '../Textarea'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Textarea/VRT',
  render: (args) => (
    <Stack>
      {[undefined, 'focus-visible'].map((id) => (
        <Stack key={id} id={id} align="flex-start">
          <Textarea {...args} disabled />
          <Textarea {...args} error />
          <Textarea {...args} width="20em" />
          <Textarea {...args} rows={3} />
          <Textarea {...args} maxLetters={5} />
          <Textarea {...args} value="テキスト" maxLetters={5} />
          <Textarea {...args} value="テキストエ" maxLetters={5} />
          <Textarea {...args} value="テキストエリア" maxLetters={5} />
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
