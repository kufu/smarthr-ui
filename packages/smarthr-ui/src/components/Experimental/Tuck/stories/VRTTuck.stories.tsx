import { Chip } from '../../../Chip'
import { Cluster, Stack } from '../../../Layout'
import { Tuck } from '../client'

import TuckStories, { MaxLines } from './Tuck.stories'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Experimental/Tuck/VRT',
  render: (args, context) => (
    <Stack>
      {MaxLines.render?.(args, context)}
      {MaxLines.render?.({ ...args, tucked: { ...args.tucked, scope: 'all' } }, context)}
      {/* HINT: 領域より広いアイテムは折り返されずに1行を占めるため、行数の上では収まって見える。
          はみ出さずにまとめられることを確かめる */}
      {(['overflowed', 'all'] as const).map((scope) => (
        // eslint-disable-next-line smarthr/best-practice-for-layouts -- Tuck は子要素を複数のアイテムとして Cluster に並べるため
        <Cluster key={scope} align="center">
          <Tuck {...args} maxLines={3} tucked={{ ...args.tucked, scope }}>
            <Chip>ラベル1</Chip>
            <Chip>{'領域より広いラベル'.repeat(5)}</Chip>
            <Chip>ラベル3</Chip>
          </Tuck>
        </Cluster>
      ))}
    </Stack>
  ),
  args: TuckStories.args,
  globals: {
    viewport: { value: 'vrtMobile' },
  },
  parameters: {
    chromatic: {
      modes: {
        vrtMobile: { viewport: 'vrtMobile' },
      },
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Tuck>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
