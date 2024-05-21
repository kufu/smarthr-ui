import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React, { ComponentProps, useState } from 'react'

import { LocaleMap } from '../../types'
import { Button } from '../Button'
import { FaQuestionCircleIcon } from '../Icon'
import { Stack } from '../Layout'

import { LanguageSwitcher } from './LanguageSwitcher'

import { AppLauncher, Header, HeaderDropdownMenuButton, HeaderLink } from '.'

export default {
  title: 'Navigation（ナビゲーション）/Header',
  component: Header,
}

const localeMap: LocaleMap = {
  ja: '日本語',
  'en-us': 'English',
  pt: 'Português',
  vi: 'Tiếng Việt',
  ko: '한국어',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文',
}

export const All: StoryFn = () => {
  const [currentLang, setLang] = useState<string>('ja')

  const handleLanguageSelect = (code: string) => {
    setLang(code)
    action('onLanguageSelect')
  }

  return (
    <Stack gap={0.25}>
      <Header />
      <Header tenants={[{ id: 'test', name: '株式会社SmartHR' }]}>
        <HeaderLink href="https://support.smarthr.jp/" prefix={<FaQuestionCircleIcon />}>
          ヘルプ
        </HeaderLink>
        <LanguageSwitcher
          locale={currentLang}
          localeMap={localeMap}
          onLanguageSelect={handleLanguageSelect}
        />
        <HeaderDropdownMenuButton label="info@example.com">
          <Button>ログアウト</Button>
        </HeaderDropdownMenuButton>
      </Header>
      <Header
        tenants={[
          { id: 'smart-hr', name: <span>株式会社スマートHR</span> },
          { id: 'smarthr', name: <span>株式会社SmartHR</span> },
        ]}
        currentTenantId="smarthr"
        onTenantSelect={(id) => console.log(id)}
      >
        <HeaderLink href="https://support.smarthr.jp/" prefix={<FaQuestionCircleIcon />}>
          ヘルプ
        </HeaderLink>
        <AppLauncher apps={launcher.apps} urlToShowAll={launcher.urlToShowAll} />
        <HeaderDropdownMenuButton label="info@example.com">
          <Button>ログアウト</Button>
        </HeaderDropdownMenuButton>
      </Header>
    </Stack>
  )
}

const launcher: ComponentProps<typeof AppLauncher> = {
  apps: [
    {
      type: 'base',
      heading: '基本機能',
      items: [
        {
          label: 'ホーム',
          url: '#',
        },
        {
          label: '従業員リスト',
          url: '#',
        },
        {
          label: '共通設定',
          url: '#',
        },
      ],
    },
    {
      heading: '人事労務',
      items: [
        {
          label: '電子申請',
          url: '#',
        },
        {
          label: '給与明細',
          url: '#',
        },
        {
          label: 'マイナンバー',
          url: '#',
        },
        {
          label: '文書配付',
          url: '#',
        },
      ],
    },
    {
      heading: '人材マネジメント',
      items: [
        {
          label: '人事評価',
          url: '#',
        },
        {
          label: '分析レポート',
          url: '#',
        },
        {
          label: '従業員サーベイ',
          url: '#',
        },
      ],
    },
    {
      heading: '連携',
      items: [
        {
          label: 'アプリケーション1',
          url: '#',
        },
        {
          label: 'アプリケーション2',
          url: '#',
        },
        {
          label: 'アプリケーション3',
          url: '#',
        },
        {
          label: 'アプリケーション4',
          url: '#',
        },
        {
          label: 'アプリケーション5',
          url: '#',
        },
        {
          label: 'アプリケーション6',
          url: '#',
        },
      ],
    },
    {
      heading: 'SmartHR Plus',
      items: [
        {
          label: 'アプリケーション1',
          url: '#',
        },
        {
          label: 'アプリケーション2',
          url: '#',
        },
        {
          label: 'アプリケーション3',
          url: '#',
        },
      ],
    },
  ],
  urlToShowAll: 'すべて見る',
}
