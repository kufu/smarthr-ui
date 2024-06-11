import { StoryFn } from '@storybook/react'
import React from 'react'

import { Text } from '../Text'

import { Footer } from './Footer'

import { ErrorScreen } from '.'

export default {
  title: 'Page Templates（ページテンプレート）/ErrorScreen',
  component: ErrorScreen,
  parameters: {
    layout: 'fullscreen',
  },
}

export const All: StoryFn = () => (
  <ErrorScreen
    title="SmartHR は現在メンテナンス中です"
    links={[
      {
        label: 'お知らせ',
        url: 'https://support.smarthr.jp/ja/info/status/page/1/',
        target: '_blank',
      },
    ]}
  >
    <Text as="p" className="shr-text-center">
      いつも SmartHR をご利用いただきありがとうございます。
      <br />
      ただいまメンテナンスのため、一時サービスを停止しております。
      <br />
      ご迷惑をおかけいたしますが、ご理解のほどよろしくお願いいたします。
    </Text>
  </ErrorScreen>
)

export const WithoutChildren: StoryFn = () => (
  <ErrorScreen
    title="サンプルタイトル"
    links={[
      {
        label: 'ホームへ',
        url: 'http://example.com',
      },
    ]}
  />
)
WithoutChildren.storyName = 'without children'

export const WithFooter: StoryFn = () => (
  <ErrorScreen links={[{ label: 'ホームへ', url: 'http://example.com' }]} footer={<Footer />} />
)
WithFooter.storyName = 'with footer'
All.storyName = 'all'
