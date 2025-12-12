import { FaCaretDownIcon, FaCirclePlusIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { AnchorButton } from '../AnchorButton'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Components/Button/AnchorButton',
  component: AnchorButton,
  render: (args) => <AnchorButton {...args} />,
  args: {
    href: '#',
    size: 'default',
    children: 'ボタン',
    variant: 'secondary',
    wide: false,
    loading: false,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof AnchorButton>

const childrens = { 文字列: 'ボタン', アイコン: <FaCirclePlusIcon /> }
const prefixes = { なし: undefined, あり: <FaCirclePlusIcon /> }
const suffixes = { なし: undefined, あり: <FaCaretDownIcon />, null: null }
const disabledReasons = { なし: undefined, あり: { message: 'ボタンが無効な理由' } }
const targets = { なし: undefined, _blank: '_blank' }

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
    disabledReason: {
      control: { type: 'radio' },
      options: Object.keys(disabledReasons),
      mapping: disabledReasons,
    },
    target: {
      control: { type: 'radio' },
      options: Object.keys(targets),
      mapping: targets,
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

export const NotSpecifiedHrefAttribute: StoryObj<typeof AnchorButton> = {
  name: 'hrefを未指定の場合(inactive, disabled相当)',
  args: {
    href: undefined,
  },
}

export const InactiveReason: StoryObj<typeof AnchorButton> = {
  name: 'inactiveReason',
  args: {
    href: undefined,
    inactiveReason: { message: 'ボタンが無効な理由' },
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

export const TargetBlank: StoryObj<typeof AnchorButton> = {
  name: 'target="_blank"',
  args: {
    target: '_blank',
    children: '別タブで開くリンク',
  },
}
