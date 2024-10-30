import React, { ComponentProps } from 'react'

import { Stack } from '../../Layout'
import { Select } from '../Select'

import type { Meta, StoryObj } from '@storybook/react'

/**
 * pict select.pict
 * disabled error width size    hasBlank
 * false    false なし   s       true
 * false    true  あり   default false
 * true     true  あり   s       true
 * true     false あり   default false
 * true     true  なし   s       false
 * false    false なし   default true
 */
const _cases: Array<Omit<ComponentProps<typeof Select>, 'options'>> = [
  { disabled: false, error: false, width: undefined, size: 's', hasBlank: true },
  { disabled: false, error: true, width: '15em', size: undefined, hasBlank: false },
  { disabled: true, error: true, width: '15em', size: 's', hasBlank: true },
  { disabled: true, error: false, width: '15em', size: undefined, hasBlank: false },
  { disabled: true, error: true, width: undefined, size: 's', hasBlank: false },
  { disabled: false, error: false, width: undefined, size: undefined, hasBlank: true },
]

export default {
  title: 'Forms（フォーム）/Select/VRT',
  render: (args) => (
    <Stack align="flex-start" gap={2}>
      {[undefined, 'hover', 'focus-visible'].map((id) => (
        <Stack id={id} align="flex-start" key={id}>
          {_cases.map((props, i) => (
            // eslint-disable-next-line smarthr/a11y-input-in-form-control
            <Select {...args} {...props} key={i} />
          ))}
        </Stack>
      ))}
    </Stack>
  ),
  args: {
    options: [{ label: '選択肢1', value: '1' }],
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs', 'skip-test-runner'],
} as Meta<typeof Select>

export const VRT: StoryObj<typeof Select> = {
  parameters: {
    pseudo: {
      hover: ['#hover select'],
      focusVisible: ['#focus-visible select'],
    },
  },
}

export const VRTForcedColors: StoryObj<typeof Select> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
