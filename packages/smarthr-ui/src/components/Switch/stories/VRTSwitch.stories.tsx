import { Stack } from '../../Layout'
import { Switch } from '../client'

import type { Meta } from '@storybook/react-vite'
import type { ComponentPropsWithoutRef } from 'react'

/**
 * $ pict switch.pict
 * unrecommendedLabelHidden  defaultChecked  disabled  size
 * true                      false           true      S
 * false                     true            false     M
 * false                     false           false     S
 * false                     true            true      S
 * true                      false           true      M
 * true                      true            false     M
 */
const _cases: Array<ComponentPropsWithoutRef<typeof Switch>> = [
  {
    unrecommendedLabelHidden: true,
    defaultChecked: false,
    disabled: true,
    size: 'S',
    children: 'ラベル',
  },
  {
    unrecommendedLabelHidden: false,
    defaultChecked: true,
    disabled: false,
    size: 'M',
    children: 'ラベル',
  },
  {
    unrecommendedLabelHidden: false,
    defaultChecked: false,
    disabled: false,
    size: 'S',
    children: 'ラベル',
  },
  {
    unrecommendedLabelHidden: false,
    defaultChecked: true,
    disabled: true,
    size: 'S',
    children: 'ラベル',
  },
  {
    unrecommendedLabelHidden: true,
    defaultChecked: false,
    disabled: true,
    size: 'M',
    children: 'ラベル',
  },
  {
    unrecommendedLabelHidden: true,
    defaultChecked: true,
    disabled: false,
    size: 'M',
    children: 'ラベル',
  },
]

export default {
  title: 'Components/Switch/VRT',
  render: (args) => (
    <Stack>
      {[undefined, 'focus-visible'].map((id) => (
        <Stack key={id} id={id} align="flex-start">
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
  tags: ['!autodocs'],
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
