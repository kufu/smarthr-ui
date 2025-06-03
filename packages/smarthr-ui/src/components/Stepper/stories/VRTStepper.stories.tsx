import type { Meta, StoryObj } from '@storybook/react'

import { Stepper } from '..'
import { Stack } from '../../Layout'

const _steps = {
  horizontal: [
    { label: 'ステップ1', status: 'completed' },
    { label: 'ステップ2', status: 'completed' },
    { label: 'ステップ3', status: { type: 'closed', text: '中断' } },
    { label: 'ステップ4' },
  ],
  vertical: [
    { label: 'ステップ1', status: 'completed', children: <div>ステップ1コンテンツ</div> },
    { label: 'ステップ2', status: 'completed', children: <div>ステップ2コンテンツ</div> },
    {
      label: 'ステップ3',
      status: { type: 'closed', text: '中断' },
      children: <div>ステップ3コンテンツ</div>,
    },
    { label: 'ステップ4', children: <div>ステップ4コンテンツ</div> },
  ],
}

export default {
  title: 'Data Display（データ表示）/Stepper/VRT',
  component: Stepper,
  render: (_) => (
    <Stack>
      {['horizontal', 'vertical'].map((type) =>
        [0, 1, 2, 3].map((activeIndex) => (
          <Stepper
            key={type}
            type={type as any}
            steps={_steps[type as 'horizontal' | 'vertical'] as any}
            activeIndex={activeIndex}
          />
        )),
      )}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Stepper>

export const VRT = {}

export const VRTForcedColors: StoryObj<typeof Stepper> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
