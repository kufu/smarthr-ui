import { action } from '@storybook/addon-actions'
import React from 'react'

import { Stack } from '../../Layout'
import { Header } from '../Header'
import { HeaderDropdownMenuButton } from '../HeaderDropdownMenuButton'
import { HeaderLink } from '../HeaderLink'

import type { Meta, StoryObj } from '@storybook/react'

const _logoOptions = {
  default: undefined,
  custom: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      className="shr-p-0.75 shr-align-bottom"
    >
      <path
        fill="#ffffff"
        fillRule="evenodd"
        d="M10.427 14.2a1.003 1.003 0 0 0 .661-1.896 2.78 2.78 0 1 1 3.54-3.537 1.003 1.003 0 0 0 1.895-.659A4.79 4.79 0 0 0 7.218 9.68a4.79 4.79 0 0 0 3.209 4.52Zm11.555 2.117a5.681 5.681 0 0 1-5.679 5.68H7.667a5.681 5.681 0 0 1-5.68-5.68V7.68a5.68 5.68 0 0 1 5.695-5.679h8.636a5.681 5.681 0 0 1 5.678 5.679v8.636h-.014Zm-.247-14.068A7.652 7.652 0 0 0 16.302 0H7.666a7.651 7.651 0 0 0-5.433 2.25A7.64 7.64 0 0 0 .587 4.691 7.637 7.637 0 0 0 0 7.682v8.636a7.652 7.652 0 0 0 2.25 5.433A7.652 7.652 0 0 0 7.685 24h8.636a7.652 7.652 0 0 0 5.433-2.25 7.638 7.638 0 0 0 1.645-2.442c.401-.946.607-1.964.605-2.991V7.68a7.661 7.661 0 0 0-2.25-5.434l-.018.002Zm-8.178 7.549a1.004 1.004 0 0 0-.66 1.894 2.78 2.78 0 1 1-3.542 3.538 1.003 1.003 0 0 0-1.894.659 4.79 4.79 0 0 0 9.305-1.572 4.79 4.79 0 0 0-3.209-4.52Z"
        clipRule="evenodd"
      />
    </svg>
  ),
}
const _tenantsOptions = {
  なし: undefined,
  あり: [
    { id: 'smart-hr', name: <span>株式会社スマートHR</span> },
    { id: 'smarthr', name: <span>株式会社SmartHR</span> },
  ],
}
const _childrenOptions = {
  なし: undefined,
  あり: <div>children</div>,
}
export const _appsOptions = {
  あり: [
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
  ],
  なし: undefined,
}

export default {
  title: 'Navigation（ナビゲーション）/Header',
  component: Header,
  subcomponents: { HeaderLink, HeaderDropdownMenuButton },
  render: (args) => <Header {...args} />,
  argTypes: {
    logo: {
      control: 'radio',
      options: Object.keys(_logoOptions),
      mapping: _logoOptions,
    },
    featureName: {
      control: 'text',
    },
    tenants: {
      control: 'radio',
      options: Object.keys(_tenantsOptions),
      mapping: _tenantsOptions,
    },
    children: {
      control: 'radio',
      options: Object.keys(_childrenOptions),
      mapping: _childrenOptions,
    },
    enableNew: { control: false },
  },
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  excludeStories: ['_appsOptions'],
  tags: ['skip-test-runner'],
} as Meta<typeof Header>

export const Playground: StoryObj<typeof Header> = {
  args: {},
}

export const Logo: StoryObj<typeof Header> = {
  name: 'logo',
  args: {
    logo: _logoOptions.custom,
  },
}

export const LogoHref: StoryObj<typeof Header> = {
  name: 'logoHref',
  args: {
    logoHref: '/',
  },
}

export const Tenants: StoryObj<typeof Header> = {
  name: 'tenants',
  render: (args) => (
    <Stack>
      {Object.entries(_tenantsOptions).map(([key, value]) => (
        <Header {...args} tenants={value} key={key} />
      ))}
    </Stack>
  ),
}

export const CurrentTenantId: StoryObj<typeof Header> = {
  name: 'currentTenantId',
  args: {
    tenants: _tenantsOptions.あり,
    currentTenantId: 'smarthr',
  },
}

export const OnTenantSelect: StoryObj<typeof Header> = {
  name: 'onTenantSelect',
  args: {
    tenants: _tenantsOptions.あり,
    onTenantSelect: action('selected'),
  },
}

export const Children: StoryObj<typeof Header> = {
  name: 'children',
  args: {
    children: _childrenOptions.あり,
  },
}
