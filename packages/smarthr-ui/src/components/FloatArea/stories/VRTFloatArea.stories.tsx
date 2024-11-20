import React from 'react'

import { Base } from '../../Base'
import { Button } from '../../Button'
import { Stack } from '../../Layout'
import { FloatArea } from '../FloatArea'

import type { Meta } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/FloatArea/VRT',
  render: (args) => (
    <Stack gap={1.5}>
      <Stack>
        {[...Array(15)].map((_, index) => (
          <Base padding={1.5} key={index}>
            <div className="shr-h-2" />
          </Base>
        ))}
      </Stack>
      <FloatArea
        {...args}
        primaryButton={<Button variant="primary">保存</Button>}
        secondaryButton={<Button>キャンセル</Button>}
        tertiaryButton={<Button>プレビュー</Button>}
        responseMessage={{ status: 'error', text: '入力に誤りがあります。' }}
      />
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof FloatArea>

export const VRT = {}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
