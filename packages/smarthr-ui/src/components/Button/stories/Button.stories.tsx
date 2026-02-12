import { FaCaretDownIcon, FaCirclePlusIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { AnchorButton } from '../AnchorButton'
import { Button } from '../Button'
import { UnstyledButton } from '../UnstyledButton'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Button',
  component: Button,
  subcomponents: { AnchorButton, UnstyledButton },
  render: (args) => <Button {...args} />,
  args: {
    size: 'default',
    children: 'ボタン',
    variant: 'secondary',
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
const disabledReasons = { なし: undefined, あり: { message: 'ボタンが無効な理由' } }

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
    disabledReason: {
      control: { type: 'radio' },
      options: Object.keys(disabledReasons),
      mapping: disabledReasons,
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
      <Button {...args} variant="tertiary">
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

export const DisabledReason: StoryObj<typeof Button> = {
  name: 'disabledReason',
  args: {
    disabled: true,
    disabledReason: { message: 'ボタンが無効な理由' },
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

export const FocusIndicatorNone_VerifyRemoval: StoryObj<typeof Button> = {
  name: '🔍 focus-indicator-none 動作確認用（マージ前に削除）',
  render: () => (
    <Stack gap={2}>
      <div className="shr-mb-1">
        <p className="shr-text-sm shr-text-grey">
          ※ 各ボタンをクリックしてフォーカスインジケータを確認してください
        </p>
      </div>
      <div>
        <p className="shr-mb-0.5 shr-text-xs shr-font-bold">通常（focus-indicatorあり）</p>
        <Button>フォーカスインジケータが表示される</Button>
      </div>
      <div>
        <p className="shr-mb-0.5 shr-text-xs shr-font-bold">focus-indicator-none適用</p>
        <Button className="focus:shr-focus-indicator-none">
          フォーカスインジケータが消える（box-shadow / outline両方なし）
        </Button>
      </div>
      <div>
        <p className="shr-mb-0.5 shr-text-xs shr-font-bold">
          focus-indicator + focus-indicator-none 両方適用
        </p>
        <Button className="focus:shr-focus-indicator focus:shr-focus-indicator-none">
          フォーカスインジケータが消える（noneが優先）
        </Button>
      </div>
      <div>
        <p className="shr-mb-0.5 shr-text-xs shr-font-bold">カスタムフォーカススタイル例</p>
        <Button className="focus:shr-outline-black focus:shr-focus-indicator-none focus:shr-outline-dashed focus:shr-outline-[3px] focus:shr-outline-offset-2">
          カスタムフォーカススタイル（黒い破線）
        </Button>
      </div>
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}
