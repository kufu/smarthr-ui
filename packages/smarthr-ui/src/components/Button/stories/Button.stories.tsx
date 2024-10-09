import React from 'react'

import { FaCaretDownIcon, FaCirclePlusIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { AnchorButton } from '../AnchorButton'
import { Button } from '../Button'
import { UnstyledButton } from '../UnstyledButton'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Buttons（ボタン）/Button',
  component: Button,
  subcomponents: { AnchorButton, UnstyledButton },
  render: (args) => <Button {...args} />,
  args: {
    size: 'default',
    children: 'ボタン',
    variant: 'secondary',
    square: false,
    disabled: false,
    wide: false,
    loading: false,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Button>

const childrens = { 文字列: 'ボタン', アイコン: <FaCirclePlusIcon /> }
const prefixes = { なし: '', あり: <FaCirclePlusIcon /> }
const suffixes = { なし: '', あり: <FaCaretDownIcon /> }
const disabledDetails = { なし: undefined, あり: { message: 'ボタンが無効な理由' } }

export const ButtonControl: StoryObj<typeof Button> = {
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

export const Variant: StoryObj<typeof Button> = {
  name: 'variant',
  render: (args) => (
    <Stack align="flex-start">
      <Button {...args}>ボタン</Button>
      <Button {...args} variant="primary">
        ボタン
      </Button>
      <Button {...args} variant="danger">
        ボタン
      </Button>
      <Button {...args} variant="text">
        ボタン
      </Button>
      <Button {...args} variant="skeleton">
        ボタン
      </Button>
    </Stack>
  ),
}

export const Size: StoryObj<typeof Button> = {
  name: 'size',
  args: {
    size: 's',
  },
}

export const Disabled: StoryObj<typeof Button> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const DisabledDetail: StoryObj<typeof Button> = {
  name: 'disabledDetail',
  args: {
    disabled: true,
    disabledDetail: { message: 'ボタンが無効な理由' },
  },
}

export const Square: StoryObj<typeof Button> = {
  name: 'square',
  args: {
    square: true,
    children: <FaCirclePlusIcon alt="ボタン" />,
  },
}

export const Wide: StoryObj<typeof Button> = {
  name: 'wide',
  args: {
    wide: true,
  },
}

export const Loading: StoryObj<typeof Button> = {
  name: 'loading',
  args: {
    loading: true,
  },
}

export const Prefix: StoryObj<typeof Button> = {
  name: 'prefix',
  args: {
    prefix: <FaCirclePlusIcon />,
  },
}

export const Suffix: StoryObj<typeof Button> = {
  name: 'suffix',
  args: {
    suffix: <FaCaretDownIcon />,
  },
}
