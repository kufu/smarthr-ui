import React, { ComponentProps } from 'react'

import { Stack } from '../../Layout'
import { Loader } from '../Loader'

import type { Meta, StoryObj } from '@storybook/react'

/**
 * $ pict loader.pict
 * size text type
 * m    なし  light
 * m    あり  primary
 * s    あり  light
 * s    なし  primary
 */
const _cases: Array<ComponentProps<typeof Loader>> = [
  { size: 'm', text: undefined, type: 'light' },
  { size: 'm', text: '読込中', type: 'primary' },
  { size: 's', text: '読込中', type: 'light' },
  { size: 's', text: undefined, type: 'primary' },
]

export default {
  title: 'States（状態）/Loader/VRT',
  render: (args) => (
    <Stack>
      {_cases.map((props, i) => (
        <div className={props.type === 'light' ? 'shr-bg-scrim' : ''} key={i}>
          <Loader {...args} {...props} />
        </div>
      ))}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Loader>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
