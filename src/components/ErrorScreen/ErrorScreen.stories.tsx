import { StoryFn } from '@storybook/react'
import React from 'react'

import { Footer } from './Footer'

import { ErrorScreen } from '.'

export default {
  title: 'Page Templates（ページテンプレート）/ErrorScreen',
  component: ErrorScreen,
  parameters: {
    layout: 'fullscreen',
  },
}

export const Full: StoryFn = () => (
  <ErrorScreen
    title="SmartHR は現在メンテナンス中です"
    links={[
      {
        label: 'SmartHR お知らせ',
        url: 'http://example.com',
        target: '_blank',
      },
    ]}
  >
    <p>
      いつも SmartHR をご利用いただきありがとうございます。
      <br />
      ただいまメンテナンスのため、一時サービスを停止しております。
      <br />
      ご迷惑をおかけいたしますが、ご理解のほどよろしくお願いいたします。
    </p>
  </ErrorScreen>
)
Full.storyName = 'full'

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
