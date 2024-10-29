import React, { ComponentProps } from 'react'

import { FaMagnifyingGlassIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { Input } from '../Input'

import type { Meta, StoryObj } from '@storybook/react'

/**
 * $ pict input.pict
 * disabled error prefix suffix bgColor placeholder width
 * false    true  なし    なし    なし    あり         あり
 * true     false あり    なし    あり    なし         なし
 * true     false なし    あり    なし    なし         あり
 * false    false なし    あり    あり    あり         なし
 * true     true  なし    あり    なし    あり         なし
 * false    true  あり    なし    あり    あり         あり
 * false    true  あり    なし    なし    なし         なし
 */
const _cases: Array<ComponentProps<typeof Input>> = [
  {
    disabled: undefined,
    error: true,
    prefix: undefined,
    suffix: undefined,
    bgColor: undefined,
    placeholder: 'プレースホルダー',
    width: '15em',
  },
  {
    disabled: true,
    error: undefined,
    prefix: <FaMagnifyingGlassIcon alt="検索" />,
    suffix: undefined,
    bgColor: 'BACKGRUOND',
    placeholder: undefined,
    width: undefined,
  },
  {
    disabled: true,
    error: undefined,
    prefix: undefined,
    suffix: <FaMagnifyingGlassIcon alt="検索" />,
    bgColor: undefined,
    placeholder: undefined,
    width: '15em',
  },
  {
    disabled: undefined,
    error: undefined,
    prefix: undefined,
    suffix: <FaMagnifyingGlassIcon alt="検索" />,
    bgColor: 'BACKGRUOND',
    placeholder: 'プレースホルダー',
    width: undefined,
  },
  {
    disabled: true,
    error: true,
    prefix: undefined,
    suffix: <FaMagnifyingGlassIcon alt="検索" />,
    bgColor: undefined,
    placeholder: 'プレースホルダー',
    width: undefined,
  },
  {
    disabled: undefined,
    error: true,
    prefix: <FaMagnifyingGlassIcon alt="検索" />,
    suffix: undefined,
    bgColor: 'BACKGRUOND',
    placeholder: 'プレースホルダー',
    width: '15em',
  },
  {
    disabled: undefined,
    error: true,
    prefix: <FaMagnifyingGlassIcon alt="検索" />,
    suffix: undefined,
    bgColor: undefined,
    placeholder: undefined,
    width: undefined,
  },
]

export default {
  title: 'Forms（フォーム）/Input/VRT',
  render: (args) => (
    <Stack align="flex-start">
      {_cases.map((props, i) => (
        // eslint-disable-next-line smarthr/a11y-input-in-form-control
        <Input {...props} {...args} key={i} />
      ))}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs', 'skip-test-runner'],
} as Meta<typeof Input>

export const VRT = {}

export const VRTHover: StoryObj<typeof Input> = {
  ...VRT,
  parameters: {
    pseudo: {
      focusWithin: ['span:has(> input)'],
    },
  },
}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
