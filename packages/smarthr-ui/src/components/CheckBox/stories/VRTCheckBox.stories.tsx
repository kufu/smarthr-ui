import { fireEvent, within } from '@storybook/test'
import React from 'react'

import { Cluster, Stack } from '../../Layout'
import { CheckBox } from '../CheckBox'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/CheckBox/VRT',
  // ペアワイズ法は使わずに総当りする
  render: (args) => {
    const mixed = [true, false]
    const error = [true, false]
    const disabled = [true, false]
    const checked = [true, false]
    return (
      <Cluster className="shr-p-1">
        {mixed.map((isMixed) =>
          error.map((isError) =>
            disabled.map((isDisabled) =>
              checked.map((isChecked) => (
                <CheckBox
                  {...args}
                  key={`${isMixed}-${isError}-${isDisabled}-${isChecked}`}
                  name={`${isMixed}-${isError}-${isDisabled}-${isChecked}`}
                  mixed={isMixed}
                  error={isError}
                  disabled={isDisabled}
                  checked={isChecked}
                />
              )),
            ),
          ),
        )}
      </Cluster>
    )
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof CheckBox>

export const VRT = {}

export const VRTHover = {
  ...VRT,
  parameters: {
    pseudo: {
      hover: ['.smarthr-ui-CheckBox-checkBox'],
    },
  },
}

export const VRTFocusVisible = {
  ...VRT,
  parameters: {
    pseudo: {
      focusVisible: ['.smarthr-ui-CheckBox-checkBox'],
    },
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
