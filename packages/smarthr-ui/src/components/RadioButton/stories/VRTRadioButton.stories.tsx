import React from 'react'

import { Cluster, Stack } from '../../Layout'
import { RadioButton } from '../RadioButton'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/RadioButton/VRT',
  render: (args) => (
    <Stack>
      {[undefined, 'hover', 'focus-visible'].map((id) => (
        <Cluster gap={2} id={id} key={id}>
          {[false, true].map((checked) =>
            [false, true].map((disabled) => (
              // eslint-disable-next-line smarthr/a11y-input-in-form-control
              <RadioButton
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
    children: 'ラジオボタン',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof RadioButton>

export const VRT: StoryObj<typeof RadioButton> = {
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
