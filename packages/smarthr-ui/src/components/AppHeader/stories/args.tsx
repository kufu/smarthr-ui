import { action } from '@storybook/addon-actions'

import type { AppHeader } from '../AppHeader'
import type { ComponentProps, FC, PropsWithChildren } from 'react'

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

export const args: ComponentProps<typeof AppHeader> = {
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
  schoolUrl: 'https://example.com',
  helpPageUrl: 'https://example.com',
  locale: {
    selectedLocale: 'ja',
    onSelectLocale: action('locale'),
  },
  userInfo: {
    email: 'smarthr@example.com',
    empCode: '001',
    firstName: '須磨',
    lastName: '栄子',
    accountUrl: 'https://example.com',
  },
  desktopAdditionalContent: <AdditionalContent>desktopAdditionalContent</AdditionalContent>,
  navigations: [
    {
      children: 'aタグ',
      href: 'https://example.com',
    },
    {
      children: 'カスタムタグ',
      elementAs: CustomLink,
      to: 'https://example.com',
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
          href: 'https://example.com',
        },
        {
          children: 'カスタムタグ',
          elementAs: CustomLink,
          to: 'https://example.com',
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
              href: 'https://example.com',
              current: true,
            },
            {
              children: 'グループ1_アイテム2',
              href: 'https://example.com',
            },
          ],
        },
        {
          title: 'グループ2',
          childNavigations: [
            {
              children: 'グループ2_アイテム1',
              href: 'https://example.com',
            },
            {
              children: 'グループ2_アイテム2',
              href: 'https://example.com',
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
        url: 'https://example.com',
      },
      {
        title: 'リリースノート2',
        url: 'https://example.com',
      },
      {
        title: 'リリースノート3',
        url: 'https://example.com',
      },
    ],
    indexUrl: 'https://example.com',
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
}
