import { userEvent, within } from '@storybook/test'
import React, { ComponentProps } from 'react'

import { FaRegCircleQuestionIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { AppLauncher } from '../AppLauncher'
import { Header } from '../Header'
import { HeaderLink } from '../HeaderLink'
import { LanguageSwitcher } from '../LanguageSwitcher'

import { _appsOptions } from './Header.stories'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/Header/VRT',
  render: (args) => (
    <Stack className="shr-h-screen">
      {[undefined, 'focus-visible'].map((id) => (
        <Stack id={id} key={id}>
          {/* {[false, true].map((enableNew) => ( */}
          <Header
            {...args}
            // enableNew={enableNew}
            // key={String(enableNew)}
          >
            <HeaderLink
              href="https://support.smarthr.jp"
              prefix={<FaRegCircleQuestionIcon />}
              // enableNew={enableNew}
            >
              ヘルプ
            </HeaderLink>
            <AppLauncher apps={launcher.apps} urlToShowAll={launcher.urlToShowAll} />
            <LanguageSwitcher
              localeMap={{
                ja: '日本語',
                'en-us': 'English',
              }}
              // enableNew={enableNew}
            />
          </Header>
          {/* ))} */}
        </Stack>
      ))}
    </Stack>
  ),
  args: {
    featureName: '基本機能',
    apps: _appsOptions.あり,
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Header>

export const VRT = {
  parameters: {
    pseudo: {
      focusVisible: ['#focus-visible a', '#focus-visible button'],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const { length, [length - 1]: last } = await canvas.findAllByRole('button', {
      // name: /基本機能/,
      name: /アプリ/,
    })
    userEvent.click(last)
  },
} satisfies Meta<typeof Header>

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
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
