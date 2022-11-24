import React from 'react'
import { Story } from '@storybook/react'
import { Header } from './'
import { Stack } from '../Layout'

export default {
  title: 'Header',
  component: Header,
}

export const all: Story = () => (
  <Stack gap={0.25}>
    <Header />
    <Header tenants="株式会社SmartHR"></Header>
    <Header
      tenants={[
        { id: 'smart-hr', name: '株式会社スマートHR' },
        { id: 'smarthr', name: '株式会社SmartHR' },
      ]}
      currentTenantId="smarthr"
      onTenantSelect={(id) => console.log(id)}
    ></Header>
    <Header
      tenants={[
        { id: 'smart-hr', name: '株式会社スマートHR' },
        { id: 'smarthr', name: '株式会社SmartHR' },
      ]}
      currentTenantId="smarthr"
      onTenantSelect={(id) => console.log(id)}
      launcher={launcher}
    ></Header>
  </Stack>
)

const launcher = {
  apps: {
    base: [
      {
        label: 'ホーム',
        url: 'http://',
      },
      {
        label: '従業員リスト',
        url: 'http://',
      },
      {
        label: '共通設定',
        url: 'http://',
      },
    ],
    roumu: [
      {
        label: '電子申請',
        url: 'http://',
      },
      {
        label: '給与明細',
        url: 'http://',
      },
      {
        label: 'マイナンバー',
        url: 'http://',
      },
      {
        label: '文書配布',
        url: 'http://',
      },
    ],
    jinmane: [
      {
        label: '人事評価',
        url: 'http://',
      },
      {
        label: '分析レポート',
        url: 'http://',
      },
      {
        label: '従業員サーベイ',
        url: 'http://',
      },
    ],
    renkei: [
      {
        label: 'おまかせ はたラクサポート連携',
        url: 'http://',
      },
      {
        label: 'KING OF TIME連携',
        url: 'http://',
      },
      {
        label: 'freee人事労務連携',
        url: 'http://',
      },
      {
        label: 'Touch On Time連携',
        url: 'http://',
      },
      {
        label: 'おまかせ はたラクサポート連携',
        url: 'http://',
      },
      {
        label: 'ジョブカン連携',
        url: 'http://',
      },
    ],
    plus: [
      {
        label: 'Smart打刻',
        url: 'http://',
      },
      {
        label: 'KING OF TIME',
        url: 'http://',
      },
      {
        label: '検診予約・結果管理システム',
        url: 'http://',
      },
    ],
  },
  urlToShowAll: 'すべて見る',
}
