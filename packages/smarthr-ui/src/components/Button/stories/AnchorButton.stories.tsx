import React from 'react'

import { FaCaretDownIcon, FaCirclePlusIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { AnchorButton } from '../AnchorButton'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Buttons（ボタン）/Button/AnchorButton',
  component: AnchorButton,
  render: (args) => <AnchorButton {...args} />,
  args: {
    href: '#',
    size: 'default',
    children: 'ボタン',
    variant: 'secondary',
    square: false,
    wide: false,
    loading: false,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof AnchorButton>

const childrens = { 文字列: 'ボタン', アイコン: <FaCirclePlusIcon /> }
const prefixes = { なし: '', あり: <FaCirclePlusIcon /> }
const suffixes = { なし: '', あり: <FaCaretDownIcon /> }
const disabledDetails = { なし: undefined, あり: { message: 'ボタンが無効な理由' } }

export const ButtonControl: StoryObj<typeof AnchorButton> = {
  name: 'Playground',
  argTypes: {
    children: {
      control: { type: 'radio' },
      options: Object.keys(childrens),
      mapping: childrens,
    },
    prefix: {
      control: { type: 'radio' },
      options: Object.keys(prefixes),
      mapping: prefixes,
    },
    suffix: {
      control: { type: 'radio' },
      options: Object.keys(suffixes),
      mapping: suffixes,
    },
    disabledDetail: {
      control: { type: 'radio' },
      options: Object.keys(disabledDetails),
      mapping: disabledDetails,
    },
  },
  args: {
    children: '文字列',
    prefix: 'なし',
    suffix: 'なし',
  },
}

export const Variant: StoryObj<typeof AnchorButton> = {
  name: 'variant',
  render: (args) => (
    <Stack align="flex-start">
      <AnchorButton {...args}>ボタン</AnchorButton>
      <AnchorButton {...args} variant="primary">
        ボタン
      </AnchorButton>
      <AnchorButton {...args} variant="danger">
        ボタン
      </AnchorButton>
      <AnchorButton {...args} variant="text">
        ボタン
      </AnchorButton>
      <AnchorButton {...args} variant="skeleton">
        ボタン
      </AnchorButton>
    </Stack>
  ),
}

export const Size: StoryObj<typeof AnchorButton> = {
  name: 'size',
  args: {
    size: 's',
  },
}

export const Disabled: StoryObj<typeof AnchorButton> = {
  name: 'disabled',
  args: {
    href: undefined,
  },
}

export const DisabledDetail: StoryObj<typeof AnchorButton> = {
  name: 'disabledDetail',
  args: {
    href: undefined,
    disabledDetail: { message: 'ボタンが無効な理由' },
  },
}

export const Square: StoryObj<typeof AnchorButton> = {
  name: 'square',
  args: {
    square: true,
    children: <FaCirclePlusIcon alt="ボタン" />,
  },
}

export const Wide: StoryObj<typeof AnchorButton> = {
  name: 'wide',
  args: {
    wide: true,
  },
}

export const Prefix: StoryObj<typeof AnchorButton> = {
  name: 'prefix',
  args: {
    prefix: <FaCirclePlusIcon />,
  },
}

export const Suffix: StoryObj<typeof AnchorButton> = {
  name: 'suffix',
  args: {
    suffix: <FaCaretDownIcon />,
  },
}
