import { action } from '@storybook/addon-actions'
import { Meta, StoryObj } from '@storybook/react/*'
import { within } from '@storybook/test'
import React, { FC, PropsWithChildren } from 'react'

import { AppHeader } from './AppHeader'
import { Locale } from './multilingualization'

const CustomLink: FC<PropsWithChildren<{ to: string; className?: string }>> = (props) => (
  <a {...props} href={props.to} className={props.className ?? ''}>
    {props.children}
  </a>
)

const AdditionalContent: FC<PropsWithChildren> = ({ children }) => (
  <div style={{ background: 'rgb(242 242 242)', padding: '4px 8px' }}>{children}</div>
)

const buildFeature = (index: number, name: string, favorite: boolean, position?: number) => ({
  id: `feature-${index}`,
  url: 'https://example.com',
  name,
  favorite,
  position: position ?? null,
})

const meta = {
  title: 'Navigation（ナビゲーション）/AppHeader',
  component: AppHeader,
  args: {
    children: <AdditionalContent>children</AdditionalContent>,
    appName: '勤怠管理',
    tenants: [
      {
        id: 'tenant-1',
        name: '株式会社テストテナント壱',
      },
      {
        id: 'tenant-2',
        name: '株式会社テストテナント弐',
      },
    ],
    currentTenantId: 'tenant-1',
    onTenantSelect: action('テナント選択'),
    schoolUrl: 'https://exmaple.com',
    helpPageUrl: 'https://exmaple.com',
    locale: {
      selectedLocale: 'ja',
      onSelectLocale: action('locale'),
    },
    userInfo: {
      email: 'smarthr@example.com',
      empCode: '001',
      firstName: '須磨',
      lastName: '栄子',
      accountUrl: 'https://exmaple.com',
    },
    desktopAdditionalContent: <AdditionalContent>desktopAdditionalContent</AdditionalContent>,
    navigations: [
      {
        children: 'aタグ',
        href: 'https://exmaple.com',
      },
      {
        children: 'カスタムタグ',
        elementAs: CustomLink,
        to: 'https://exmaple.com',
      },
      {
        children: 'ボタン',
        onClick: action('AppNavボタンクリック'),
      },
      {
        children: 'ドロップダウン',
        childNavigations: [
          {
            children: 'aタグ',
            href: 'https://exmaple.com',
          },
          {
            children: 'カスタムタグ',
            elementAs: CustomLink,
            to: 'https://exmaple.com',
          },
          {
            children: 'ボタン',
            onClick: action('ボタンクリック'),
          },
        ],
      },
      {
        children: 'グループ',
        childNavigations: [
          {
            title: 'グループ1',
            childNavigations: [
              {
                children: 'グループ1_アイテム1',
                href: 'https://exmaple.com',
                current: true,
              },
              {
                children: 'グループ1_アイテム2',
                href: 'https://exmaple.com',
              },
            ],
          },
          {
            title: 'グループ2',
            childNavigations: [
              {
                children: 'グループ2_アイテム1',
                href: 'https://exmaple.com',
              },
              {
                children: 'グループ2_アイテム2',
                href: 'https://exmaple.com',
              },
            ],
          },
        ],
      },
    ],
    desktopNavigationAdditionalContent: (
      <AdditionalContent>desktopNavigationAdditionalContent</AdditionalContent>
    ),
    releaseNote: {
      links: [
        {
          title: 'リリースノート1',
          url: 'https://exmaple.com',
        },
        {
          title: 'リリースノート2',
          url: 'https://exmaple.com',
        },
        {
          title: 'リリースノート3',
          url: 'https://exmaple.com',
        },
      ],
      indexUrl: 'https://exmaple.com',
    },
    features: [
      buildFeature(1, '従業員リスト', false),
      buildFeature(2, '共通設定', true, 4),
      buildFeature(3, 'お知らせ管理', true, 3),
      buildFeature(4, '給与明細', true, 1),
      buildFeature(5, '申請', false),
      buildFeature(6, '給与明細管理', false),
      buildFeature(7, 'マイナンバー管理', false),
      buildFeature(8, '源泉徴収票管理', false),
      buildFeature(9, '手続き', false),
      buildFeature(10, '手続きToDo', false),
      buildFeature(11, '文書配付', false),
      buildFeature(12, 'IdP', true, 2),
    ],
    mobileAdditionalContent: <AdditionalContent>mobileAdditionalContent</AdditionalContent>,
  },
  parameters: {
    useFixedHeight: true,
  },
} satisfies Meta<typeof AppHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const VRTNameOnly: Story = {
  args: {
    userInfo: {
      email: 'smarthr@example.com',
      empCode: null,
      firstName: '須磨',
      lastName: '栄子',
      accountUrl: 'https://exmaple.com',
    },
  },
}

export const VRTEmpCodeOnly: Story = {
  args: {
    userInfo: {
      email: 'smarthr@example.com',
      empCode: '001',
      firstName: null,
      lastName: null,
      accountUrl: 'https://exmaple.com',
    },
  },
}

export const VRTEmailOnly: Story = {
  args: {
    userInfo: {
      email: 'smarthr@example.com',
      empCode: null,
      firstName: null,
      lastName: null,
      accountUrl: 'https://exmaple.com',
    },
  },
}

export const VRTNoUserInfo: Story = {
  args: {
    userInfo: {
      email: null,
      empCode: null,
      firstName: null,
      lastName: null,
      accountUrl: 'https://exmaple.com',
    },
  },
}

export const VRTSingleTenant: Story = {
  args: {
    tenants: [
      {
        id: 'tenant-1',
        name: '株式会社テストテナント壱',
      },
    ],
  },
}

export const VRTNoNavigations: Story = {
  args: {
    navigations: undefined,
  },
}

export const VRTTenant: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: '株式会社テストテナント壱 候補を開く' }).click()
  },
}

export const VRTLauncher: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'アプリ' }).click()
  },
}

export const VRTReleaseNote: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'リリースノート' }).click()
  },
}

export const VRTReleaseNoteLoading: Story = {
  args: {
    releaseNote: {
      loading: true,
      links: [],
      indexUrl: 'https://exmaple.com',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'リリースノート' }).click()
  },
}

export const VRTReleaseNoteError: Story = {
  args: {
    releaseNote: {
      error: true,
      links: [],
      indexUrl: 'https://exmaple.com',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'リリースノート' }).click()
  },
}

export const VRTSetting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: '栄子 須磨（001）' }).click()
  },
}

export const VRTNavigationDropdown: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'ドロップダウン' }).click()
  },
}

export const VRTNavigationDropdownGroup: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'グループ' }).click()
  },
}

export const VRTLocaleEnUs: Story = {
  args: {
    locale: {
      selectedLocale: 'en-us',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}

export const VRTLocaleIdId: Story = {
  args: {
    locale: {
      selectedLocale: 'id-id',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}

export const VRTLocalePt: Story = {
  args: {
    locale: {
      selectedLocale: 'pt',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}

export const VRTLocaleVi: Story = {
  args: {
    locale: {
      selectedLocale: 'vi',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}

export const VRTLocaleKo: Story = {
  args: {
    locale: {
      selectedLocale: 'ko',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}

export const VRTLocaleZhCn: Story = {
  args: {
    locale: {
      selectedLocale: 'zh-cn',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}

export const VRTLocaleZhTw: Story = {
  args: {
    locale: {
      selectedLocale: 'zh-tw',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}
