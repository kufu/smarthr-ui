import { action } from '@storybook/addon-actions'
import { Meta, StoryObj } from '@storybook/react/*'
import React, { FC, PropsWithChildren } from 'react'

import { AppHeader } from './AppHeader'

const CustomLink: FC<PropsWithChildren<{ to: string; className?: string }>> = (props) => (
  <a {...props} href={props.to} className={props.className ?? ''}>
    {props.children}
  </a>
)

const AdditionalContent: FC<PropsWithChildren> = ({ children }) => (
  <div style={{ background: 'rgb(242 242 242)', padding: '4px 8px' }}>{children}</div>
)

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
  },
} satisfies Meta<typeof AppHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const EnableNew: Story = {
  args: {
    enableNew: true,
  },
}
