import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Header } from './Header'

const employeeButtonMenu = [
  {
    type: 'link' as 'link',
    title: '新規登録する（手入力）',
    url: '/crews/new',
    icon: 'fa-edit' as 'fa-edit',
  },
  {
    type: 'link' as 'link',
    title: '新規登録する（ファイル）',
    url: '/crews/bulk_inserter',
    icon: 'fa-reg-plus-square' as 'fa-reg-plus-square',
  },
  {
    type: 'link' as 'link',
    title: '更新する（ファイル）',
    url: '/crews/bulk_updater',
    icon: 'fa-sync-alt' as 'fa-sync-alt',
  },
  {
    type: 'divider' as 'divider',
  },
  {
    type: 'link' as 'link',
    title: 'SmartHR に招待',
    url: '/crews/inviter',
    icon: 'fa-paper-plane' as 'fa-paper-plane',
  },
]

const userButtonMenu = [
  {
    type: 'header' as 'header',
    title: 'test@smarthr.co.jp',
  },
  {
    type: 'link' as 'link',
    title: '個人設定',
    url: '/my/account',
    icon: 'fa-cog' as 'fa-cog',
  },
  {
    type: 'divider' as 'divider',
  },
  {
    type: 'header' as 'header',
    title: '株式会社TESTINC',
  },
  {
    type: 'link' as 'link',
    title: '共通設定',
    url: '/admin/company',
    icon: 'fa-building' as 'fa-building',
  },
  {
    type: 'divider' as 'divider',
  },
  {
    type: 'link' as 'link',
    title: 'ヘルプ',
    url: 'https://smarthr.jp/hel',
    icon: 'fa-question-circle' as 'fa-question-circle',
    target: '_blank',
  },
  {
    type: 'link' as 'link',
    title: 'SmartHR スクール',
    url: 'https://smarthr.thinkific.com/',
    icon: 'fa-graduation-cap' as 'fa-graduation-cap',
    target: '_blank',
  },
  {
    type: 'link' as 'link',
    title: 'ログアウト',
    url: 'https://test-inc.smarthr.jp/logout',
    icon: 'fa-power-off' as 'fa-power-off',
  },
]

storiesOf('Header', module).add('all', () => (
  <Header
    tenantName="TESTINC 株式会社"
    helpButtonLink="https://smarthr.jp/help/"
    employeeListButtonLink="/crews"
    userMailAddress="test@smarthr.co.jp"
    employeeButtonMenu={employeeButtonMenu}
    userButtonMenu={userButtonMenu}
    notificationNumber={100}
  />
))
