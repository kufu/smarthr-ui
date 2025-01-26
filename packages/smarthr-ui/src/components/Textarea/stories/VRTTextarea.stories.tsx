/* eslint-disable smarthr/a11y-prohibit-input-placeholder */
/* eslint-disable smarthr/a11y-input-in-form-control */
import React from 'react'

import { Stack } from '../../Layout'
import { Textarea } from '../Textarea'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/Textarea/VRT',
  render: (args) => (
    <Stack>
      {[undefined, 'focus-visible'].map((id) => (
        <Stack id={id} key={id} align="flex-start">
          <Textarea {...args} disabled />
          <Textarea {...args} error />
          <Textarea {...args} width="20em" />
          <Textarea {...args} rows={3} />
          <Textarea {...args} maxLetters={5} />
          <Textarea {...args} maxLetters={5} value="テキスト" />
          <Textarea {...args} maxLetters={5} value="テキストエ" />
          <Textarea {...args} maxLetters={5} value="テキストエリア" />
          <Textarea
            {...args}
            maxLetters={5}
            value="テキストエ"
            decorators={{
              beforeMaxLettersCount: (org) => `beforeMaxLettersCount(${org})`,
              afterMaxLettersCount: (org) => `afterMaxLettersCount(${org})`,
              afterMaxLettersCountExceeded: (org) => `afterMaxLettersCountExceeded(${org})`,
              beforeScreenReaderMaxLettersDescription: (org) =>
                `beforeScreenReaderMaxLettersDescription(${org})`,
              afterScreenReaderMaxLettersDescription: (org) =>
                `afterScreenReaderMaxLettersDescription(${org})`,
            }}
          />
          <Textarea
            {...args}
            maxLetters={5}
            value="テキストエリア"
            decorators={{
              beforeMaxLettersCount: (org) => `beforeMaxLettersCount(${org})`,
              afterMaxLettersCount: (org) => `afterMaxLettersCount(${org})`,
              afterMaxLettersCountExceeded: (org) => `afterMaxLettersCountExceeded(${org})`,
              beforeScreenReaderMaxLettersDescription: (org) =>
                `beforeScreenReaderMaxLettersDescription(${org})`,
              afterScreenReaderMaxLettersDescription: (org) =>
                `afterScreenReaderMaxLettersDescription(${org})`,
            }}
          />
          <Textarea {...args} placeholder="テキストエリア" />
        </Stack>
      ))}
    </Stack>
  ),
  parameters: {
    pseudo: {
      focusVisible: ['#focus-visible textarea'],
    },
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs', 'skip-test-runner'],
} satisfies Meta<typeof Textarea>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
