/* eslint-disable smarthr/a11y-input-in-form-control */
import { action } from '@storybook/addon-actions'
import React from 'react'

import { Stack } from '../../Layout'
import { InputFile } from '../InputFile'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/InputFile',
  component: InputFile,
  render: (args) => <InputFile {...args} />,
  argTypes: {
    label: { control: 'text' },
    multiple: { control: 'boolean' },
  },
  args: {
    label: 'ファイルを選択',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof InputFile>

export const Playground: StoryObj<typeof InputFile> = {
  args: {},
}

export const Label: StoryObj<typeof InputFile> = {
  name: 'label',
  args: { label: 'ファイルを選択' },
}

export const Size: StoryObj<typeof InputFile> = {
  name: 'size',
  render: (args) => (
    <Stack>
      {[undefined, 'default', 's'].map((size) => (
        <InputFile {...args} size={size as any} key={size} />
      ))}
    </Stack>
  ),
}

export const Multiple: StoryObj<typeof InputFile> = {
  name: 'multiple',
  args: { multiple: true },
}

export const Disabled: StoryObj<typeof InputFile> = {
  name: 'disabled',
  args: { disabled: true },
}

export const Error: StoryObj<typeof InputFile> = {
  name: 'error',
  args: { error: true },
}

export const HasFileList: StoryObj<typeof InputFile> = {
  name: 'hasFileList',
  render: (args) => (
    <Stack>
      {[true, false].map((hasFileList) => (
        <InputFile
          {...args}
          hasFileList={hasFileList as any}
          label={`hasFileList: ${hasFileList}`}
          key={String(hasFileList)}
        />
      ))}
    </Stack>
  ),
}

export const OnChange: StoryObj<typeof InputFile> = {
  name: 'onChange',
  args: { onChange: action('changed') },
}
