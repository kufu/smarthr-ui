import React from 'react'

import { Stack } from '../../../Layout'
import InputStory from '../../stories/Input.stories'
import { SearchInput } from '../SearchInput'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/SearchInput',
  component: SearchInput,
  // eslint-disable-next-line smarthr/a11y-input-in-form-control
  render: (args) => <SearchInput {...args} />,
  args: {
    tooltipMessage: '氏名、ヨミガナ、社員番号で検索できます。スペース区切りでAND検索ができます。',
  },
  argTypes: {
    suffix: InputStory.argTypes?.suffix,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['skip-test-runner'],
} as Meta<typeof SearchInput>

export const Playground: StoryObj<typeof SearchInput> = {}

export const TooltipMessage: StoryObj<typeof SearchInput> = {
  name: 'tooltipMessage',
}

export const Disabled: StoryObj<typeof SearchInput> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const Error: StoryObj<typeof SearchInput> = {
  name: 'error',
  args: {
    error: true,
  },
}

export const Placeholder: StoryObj<typeof SearchInput> = {
  name: 'placeholder（非推奨）',
  args: {
    placeholder: 'プレースホルダー',
  },
}

export const Width: StoryObj<typeof SearchInput> = {
  name: 'width',
  render: (args) => (
    <Stack align="flex-start">
      {['15em', '50%', 200].map((width) => (
        // eslint-disable-next-line smarthr/a11y-input-in-form-control
        <SearchInput {...args} width={width} key={width} />
      ))}
    </Stack>
  ),
}
