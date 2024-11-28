import React from 'react'

import { ResponseMessage } from '../../ResponseMessage'
import { SmartHRLogo } from '../../SmartHRLogo'
import { ErrorScreen } from '../ErrorScreen'

import type { Meta, StoryObj } from '@storybook/react'

const logoOptions = {
  デフォルト: undefined,
  ReactNode: <div>ロゴ</div>,
}

const titleOptions = {
  なし: undefined,
  文字列: 'エラーが発生しました',
  ReactNode: <ResponseMessage type="error">エラーが発生しました</ResponseMessage>,
}

const linksOptions = {
  なし: undefined,
  単数: [{ label: 'ホームに戻る', url: '/' }],
  複数: [
    { label: 'ホームに戻る', url: '/' },
    { label: 'お問い合わせ', url: '/contact' },
  ],
}

const childrenOptions = {
  なし: undefined,
  あり: 'Children',
}

export default {
  title: 'Page Templates（ページテンプレート）/ErrorScreen',
  component: ErrorScreen,
  render: (args) => <ErrorScreen {...args} />,
  args: {
    title: titleOptions['文字列'],
    links: linksOptions['なし'],
    logo: logoOptions['デフォルト'],
    children: childrenOptions['なし'],
  },
  argTypes: {
    logo: {
      control: { type: 'radio' },
      options: Object.keys(logoOptions),
      mapping: logoOptions,
    },
    title: {
      control: { type: 'radio' },
      options: Object.keys(titleOptions),
      mapping: titleOptions,
    },
    links: {
      control: { type: 'radio' },
      options: Object.keys(linksOptions),
      mapping: linksOptions,
    },
    children: {
      control: { type: 'radio' },
      options: Object.keys(childrenOptions),
      mapping: childrenOptions,
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ErrorScreen>

export const Playground: StoryObj<typeof ErrorScreen> = {
  args: {},
}

export const Logo: StoryObj<typeof ErrorScreen> = {
  name: 'logo',
  args: {
    logo: <SmartHRLogo fill="black" />,
  },
}

export const Title: StoryObj<typeof ErrorScreen> = {
  name: 'title',
  args: {
    title: '任意のタイトルを設定できます',
  },
}

export const Links: StoryObj<typeof ErrorScreen> = {
  name: 'links',
  args: {
    links: [
      {
        label: '複数のリンクを',
        url: '/',
      },
      {
        label: '設定できます',
        url: '/contact',
      },
    ],
  },
}
