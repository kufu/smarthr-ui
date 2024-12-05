import React from 'react'

import { backgroundColor } from '../../../themes'
import { NewAppLauncher } from '../NewAppLauncher'

import type { Meta, StoryObj } from '@storybook/react'

const apps = [
  {
    type: 'base',
    heading: '基本機能',
    items: [
      { label: 'ホーム', url: '#' },
      { label: '従業員リスト', url: '#' },
      { label: '共通設定', url: '#' },
    ],
  },
  {
    heading: '人事労務',
    items: [
      { label: '電子申請', url: '#' },
      { label: '給与明細', url: '#' },
      { label: 'マイナンバー', url: '#' },
      { label: '文書配付', url: '#' },
    ],
  },
  {
    heading: '人材マネジメント',
    items: [
      { label: '人事評価', url: '#' },
      { label: '分析レポート', url: '#' },
      { label: '従業員サーベイ', url: '#' },
    ],
  },
  {
    heading: '連携',
    items: [
      { label: 'アプリケーション1', url: '#' },
      { label: 'アプリケーション2', url: '#' },
      { label: 'アプリケーション3', url: '#' },
      { label: 'アプリケーション4', url: '#' },
      { label: 'アプリケーション5', url: '#' },
      { label: 'アプリケーション6', url: '#' },
    ],
  },
  {
    heading: 'SmartHR Plus',
    items: [
      { label: 'アプリケーション1', url: '#' },
      { label: 'アプリケーション2', url: '#' },
      { label: 'アプリケーション3', url: '#' },
    ],
  },
]

export default {
  title: 'Navigation（ナビゲーション）/Header/NewAppLauncher',
  component: NewAppLauncher,
  render: (args) => <NewAppLauncher {...args} />,
  argTypes: {
    urlToShowAll: { control: 'text' },
  },
  args: {
    apps,
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.brand }],
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof NewAppLauncher>

export const Playground: StoryObj<typeof NewAppLauncher> = {}

export const UrlToShowAll: StoryObj<typeof NewAppLauncher> = {
  name: 'urlToShowAll',
  args: {
    urlToShowAll: '#',
  },
}

export const EnableNew: StoryObj<typeof NewAppLauncher> = {
  name: 'enableNew',
  args: {
    enableNew: true,
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.white }],
    },
  },
}
