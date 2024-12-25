import { action } from '@storybook/addon-actions'
import React from 'react'

import { backgroundColor } from '../../../themes'
import { FaMagnifyingGlassIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { CurrencyInput } from '../CurrencyInput'
import { Input, bgColors } from '../Input'
import { SearchInput } from '../SearchInput'

import type { Meta, StoryObj } from '@storybook/react'

const _affixOptions = {
  あり: <FaMagnifyingGlassIcon alt="検索" />,
  なし: undefined,
}

export default {
  title: 'Forms（フォーム）/Input',
  component: Input,
  subcomponents: { CurrencyInput, SearchInput },
  // eslint-disable-next-line smarthr/a11y-input-in-form-control
  render: (args) => <Input {...args} />,
  argTypes: {
    prefix: {
      control: 'radio',
      options: Object.keys(_affixOptions),
      mapping: _affixOptions,
    },
    suffix: {
      control: 'radio',
      options: Object.keys(_affixOptions),
      mapping: _affixOptions,
    },
    readOnly: {
      control: 'boolean',
    },
  },
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['skip-test-runner'],
} as Meta<typeof Input>

export const Playground: StoryObj<typeof Input> = {}

export const Type: StoryObj<typeof Input> = {
  name: 'type',
  render: (args) => (
    <Stack>
      {[undefined, 'text', 'number', 'password', 'date', 'datetime-local', 'time', 'month'].map(
        (type) => (
          <label key={type}>
            {`${type ?? '未指定'}： `}
            {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
            <Input {...args} type={type} key={type} />
          </label>
        ),
      )}
    </Stack>
  ),
}

export const Disabled: StoryObj<typeof Input> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const Error: StoryObj<typeof Input> = {
  name: 'error',
  args: {
    error: true,
  },
}

export const Prefix: StoryObj<typeof Input> = {
  name: 'prefix',
  args: {
    prefix: <FaMagnifyingGlassIcon alt="検索" />,
  },
}

export const Suffix: StoryObj<typeof Input> = {
  name: 'suffix',
  args: {
    suffix: <FaMagnifyingGlassIcon alt="検索" />,
  },
}

export const BgColor: StoryObj<typeof Input> = {
  name: 'bgColor',
  render: (args) => (
    <Stack>
      {([undefined, ...Object.keys(bgColors)] as Array<keyof typeof bgColors>).map((bgColor) => (
        // eslint-disable-next-line smarthr/a11y-input-in-form-control
        <Input {...args} bgColor={bgColor} key={bgColor} />
      ))}
    </Stack>
  ),
}

export const Placeholder: StoryObj<typeof Input> = {
  name: 'placeholder（非推奨）',
  args: {
    placeholder: 'プレースホルダー',
  },
}

export const Width: StoryObj<typeof Input> = {
  name: 'width',
  render: (args) => (
    <Stack align="flex-start">
      {['15em', '50%', 200].map((width) => (
        // eslint-disable-next-line smarthr/a11y-input-in-form-control
        <Input {...args} width={width} key={width} />
      ))}
    </Stack>
  ),
}

export const ReadOnly: StoryObj<typeof Input> = {
  name: 'readOnly',
  args: {
    readOnly: true,
    value: '読み取り専用',
  },
  parameters: {
    backgrounds: { values: [{ name: 'light', value: backgroundColor.white }] },
  },
}

export const Handlers: StoryObj<typeof Input> = {
  name: 'handlers',
  render: (args) => (
    // eslint-disable-next-line smarthr/a11y-input-in-form-control
    <Input {...args} onChange={action('onChange')} onBlur={action('onBlur')} />
  ),
}
