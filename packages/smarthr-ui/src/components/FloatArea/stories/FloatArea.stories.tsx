import React from 'react'

import { ResponseMessageType } from '../../../types'
import { Base } from '../../Base'
import { Button } from '../../Button'
import { Stack } from '../../Layout'
import { FloatArea } from '../FloatArea'

import type { Meta, StoryObj } from '@storybook/react'

const _primaryButtonOptions = {
  'あり（省略不可）': <Button variant="primary">プライマリーボタン</Button>,
}

const _secondaryButtonOptions = {
  なし: undefined,
  あり: <Button>セカンダリーボタン</Button>,
}

const _tertiaryButtonOptions = {
  なし: undefined,
  あり: <Button>ターシャリーボタン</Button>,
}

const _responseMessageOptions: { [key: string]: ResponseMessageType | undefined } = {
  なし: undefined,
  success: { status: 'success', text: '成功メッセージです。' },
  error: { status: 'error', text: '失敗メッセージです。' },
}

export default {
  title: 'Navigation（ナビゲーション）/FloatArea',
  component: FloatArea,
  render: (args) => <FloatArea {...args} />,
  argTypes: {
    primaryButton: {
      control: 'radio',
      options: Object.keys(_primaryButtonOptions),
      mapping: _primaryButtonOptions,
    },
    secondaryButton: {
      control: 'radio',
      options: Object.keys(_secondaryButtonOptions),
      mapping: _secondaryButtonOptions,
    },
    tertiaryButton: {
      control: 'radio',
      options: Object.keys(_tertiaryButtonOptions),
      mapping: _tertiaryButtonOptions,
    },
    responseMessage: {
      control: 'radio',
      options: Object.keys(_responseMessageOptions),
      mapping: _responseMessageOptions,
    },
  },
  args: {
    primaryButton: <Button variant="primary">保存</Button>,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof FloatArea>

export const Playground: StoryObj<typeof FloatArea> = {
  args: {
    secondaryButton: <Button>キャンセル</Button>,
  },
}

export const PrimaryButton: StoryObj<typeof FloatArea> = {
  name: 'primaryButton',
  args: {
    primaryButton: _primaryButtonOptions['あり（省略不可）'],
  },
}

export const SecondaryButton: StoryObj<typeof FloatArea> = {
  name: 'secondaryButton',
  args: {
    secondaryButton: _secondaryButtonOptions.あり,
  },
}

export const TertiaryButton: StoryObj<typeof FloatArea> = {
  name: 'tertiaryButton',
  args: {
    tertiaryButton: _tertiaryButtonOptions.あり,
  },
}

export const ResponseMessage: StoryObj<typeof FloatArea> = {
  name: 'responseMessage',
  args: {
    responseMessage: _responseMessageOptions.success,
  },
}

export const Bottom: StoryObj<typeof FloatArea> = {
  name: 'bottom',
  render: (args) => (
    <Stack gap={1.5}>
      {[...Array(15)].map((_, index) => (
        <Base padding={1.5} key={index}>
          <p>bottom を確認するための Base</p>
        </Base>
      ))}
      <FloatArea {...args} />
    </Stack>
  ),
  args: {
    bottom: 1.5,
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: '400px',
      },
    },
  },
}

export const ZIndex: StoryObj<typeof FloatArea> = {
  name: 'zIndex',
  args: {
    zIndex: 1,
  },
}
