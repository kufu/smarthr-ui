import React from 'react'

import { Cluster, Stack } from '../../Layout'
import { RadioButtonPanel } from '../RadioButtonPanel'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/RadioButtonPanel/VRT',
  render: (args) => (
    <Stack>
      {[undefined, 'hover', 'focus-visible'].map((id) => (
        <Cluster gap={2} id={id} key={id}>
          {[false, true].map((checked) =>
            [false, true].map((disabled) => (
              // eslint-disable-next-line smarthr/a11y-input-in-form-control
              <RadioButtonPanel
                {...args}
                checked={checked}
                disabled={disabled}
                key={`${id}-${checked}-${disabled}`}
              />
            )),
          )}
        </Cluster>
      ))}
    </Stack>
  ),
  args: {
    children: 'ラジオボタンパネル',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof RadioButtonPanel>

export const VRT: StoryObj<typeof RadioButtonPanel> = {
  parameters: {
    pseudo: {
      hover: ['#hover .smarthr-ui-RadioButton-radioButton'],
      focusVisible: ['#focus-visible .smarthr-ui-RadioButton-radioButton'],
    },
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
