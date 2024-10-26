import React from 'react'

import { FaCircleQuestionIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { Tooltip } from '../Tooltip'

import type { Meta, StoryObj } from '@storybook/react'

const _messages = {
  'テキスト（sting）': 'メッセージ',
  '複数行（ReactNode）': (
    <>
      複数行
      <br />
      メッセージ
    </>
  ),
}

export default {
  title: 'Data Display（データ表示）/Tooltip',
  component: Tooltip,
  render: (args) => <Tooltip {...args} />,
  argTypes: {
    message: {
      control: 'radio',
      options: Object.keys(_messages),
      mapping: _messages,
    },
  },
  args: {
    message: 'ツールチップ',
    children: 'ツールチップ',
    vertical: 'auto',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Tooltip>

export const Playground: StoryObj<typeof Tooltip> = {
  args: {},
}

export const Message: StoryObj<typeof Tooltip> = {
  name: 'message',
  args: {
    message: 'ツールチップに表示したいメッセージ',
  },
}

// なにこれ? いるの?
export const TriggerType: StoryObj<typeof Tooltip> = {
  name: 'triggerType',
  args: {
    triggerType: 'icon',
    children: <FaCircleQuestionIcon alt="ツールチップ" />,
  },
}

// これなんで必要なの?
export const Multiline: StoryObj<typeof Tooltip> = {
  name: 'multiLine',
  args: {
    multiLine: true,
    message: _messages['複数行（ReactNode）'],
  },
}

// これテキストの場合はデフォルトでいいんじゃないの?
export const EllipsisOnly: StoryObj<typeof Tooltip> = {
  name: 'ellipsisOnly',
  render: (args) => (
    <div className="shr-w-[5em]">
      <Tooltip {...args}>
        <span className="shr-inline-block shr-max-w-full shr-overflow-hidden shr-text-ellipsis shr-text-nowrap">
          省略されるメッセージ
        </span>
      </Tooltip>
    </div>
  ),
  args: {
    message: '省略されるメッセージ',
    ellipsisOnly: true,
  },
}

export const Horizontal: StoryObj<typeof Tooltip> = {
  name: 'horizontal',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, 'center', 'left', 'right', 'auto'].map((horizontal) => (
        <Tooltip {...args} horizontal={horizontal as any} key={horizontal}>
          horizontal: {horizontal}
        </Tooltip>
      ))}
    </Stack>
  ),
}

export const Vertical: StoryObj<typeof Tooltip> = {
  name: 'vertical',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, 'top', 'bottom', 'middle', 'auto'].map((vertical) => (
        <Tooltip {...args} vertical={vertical as any} key={vertical}>
          vertical: {vertical}
        </Tooltip>
      ))}
    </Stack>
  ),
}

export const TabIndex: StoryObj<typeof Tooltip> = {
  name: 'tabIndex',
  args: {
    tabIndex: -1, // キーボードアクセスできなくなるため、良い例ではない
  },
}

export const AriaDescribedbyTarget: StoryObj<typeof Tooltip> = {
  name: 'ariaDescribedbyTarget',
  args: {
    ariaDescribedbyTarget: 'inner',
    triggerType: 'icon',
    children: <FaCircleQuestionIcon alt="ツールチップ" />,
  },
}
