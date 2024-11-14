import React, { ComponentProps } from 'react'

import { Stack } from '../../Layout'
import { Switch } from '../Switch'

import type { Meta } from '@storybook/react'

/**
 * $ pict switch.pict
 * dangerouslyLabelHidden  defaultChecked  disabled
 * true                    true            true
 * true                    false           false
 * false                   false           true
 * false                   true            false
 */
const _cases: Array<ComponentProps<typeof Switch>> = [
  {
    dangerouslyLabelHidden: true,
    defaultChecked: true,
    disabled: true,
    children: 'ラベル',
  },
  {
    dangerouslyLabelHidden: true,
    defaultChecked: false,
    disabled: undefined,
    children: 'ラベル',
  },
  {
    dangerouslyLabelHidden: false,
    defaultChecked: undefined,
    disabled: true,
    children: 'ラベル',
  },
  {
    dangerouslyLabelHidden: undefined,
    defaultChecked: true,
    disabled: false,
    children: 'ラベル',
  },
]

export default {
  title: 'Forms（フォーム）/Switch/VRT',
  render: (args) => (
    <Stack>
      {[undefined, 'focus-visible'].map((id) => (
        <Stack align="flex-start" id={id} key={id}>
          {_cases.map((props, i) => (
            <Switch {...props} {...args} key={i} className="smarthr-ui-Switch" />
          ))}
        </Stack>
      ))}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
    pseudo: {
      focusVisible: ['#focus-visible .smarthr-ui-Switch'],
    },
  },
  tags: ['!autodocs', 'skip-test-runner'],
} as Meta<typeof Switch>

export const VRT = {}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
    pseudo: {
      focusVisible: ['#focus-visible .smarthr-ui-Switch'],
    },
  },
}
