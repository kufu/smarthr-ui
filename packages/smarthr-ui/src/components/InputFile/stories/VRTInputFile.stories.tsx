/* eslint-disable smarthr/a11y-input-in-form-control */
import React from 'react'

import { Stack } from '../../Layout'
import { InputFile } from '../InputFile'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/InputFile/VRT',
  render: (args) => (
    <Stack>
      {[undefined, 'hover', 'focus-within'].map((id) => (
        <Stack id={id} key={id}>
          {[undefined, 'default', 's'].map((size) =>
            [false, true].map((disabled) =>
              [false, true].map((error) => (
                <InputFile
                  {...args}
                  size={size as any}
                  disabled={disabled}
                  error={error}
                  key={`${size}-${disabled}-${error}`}
                />
              )),
            ),
          )}
        </Stack>
      ))}
    </Stack>
  ),
  args: {
    label: 'ファイルを選択',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof InputFile>

export const VRT = {
  parameters: {
    pseudo: {
      hover: ['#hover span'],
      focusWithin: ['#focus-within span'],
    },
  },
}

export const VRTForcedColors: StoryObj = {
  parameters: {
    ...VRT.parameters,
    chromatic: { forcedColors: 'active' },
  },
}
