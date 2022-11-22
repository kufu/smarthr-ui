import React from 'react'
import { Story } from '@storybook/react'
import { Header, HeaderDropdownButton, HeaderLink } from './'
import { Stack } from '../Layout'
import { FaGraduationCapIcon, FaQuestionCircleIcon, FaToolboxIcon } from '../Icon'
import { Button } from '../Button'

export default {
  title: 'Header',
  component: Header,
}

export const all: Story = () => (
  <Stack gap={0.25}>
    <Header />
    <Header tenants="株式会社SmartHR">
      <HeaderLink href="https://support.smarthr.jp/" prefix={<FaQuestionCircleIcon />}>
        ヘルプ
      </HeaderLink>
      <HeaderDropdownButton label="info@example.com">
        <Button>ログアウト</Button>
      </HeaderDropdownButton>
    </Header>
    <Header
      tenants={[
        { id: 'smart-hr', name: '株式会社スマートHR' },
        { id: 'smarthr', name: '株式会社SmartHR' },
      ]}
      currentTenantId="smarthr"
      onTenantSelect={(id) => console.log(id)}
    >
      <HeaderLink href="https://school.smarthr.jp/" prefix={<FaGraduationCapIcon />}>
        スクール
      </HeaderLink>
      <HeaderLink href="https://support.smarthr.jp/" prefix={<FaQuestionCircleIcon />}>
        ヘルプ
      </HeaderLink>
      <HeaderLink href="https://support.smarthr.jp/">リリースノート</HeaderLink>
      <HeaderDropdownButton label="アプリ" prefix={<FaToolboxIcon />}>
        <Button>ログアウト</Button>
      </HeaderDropdownButton>
      <HeaderDropdownButton label="info@example.com">
        <Button>ログアウト</Button>
      </HeaderDropdownButton>
    </Header>
    <Header
      tenants={[
        { id: 'smart-hr', name: '株式会社スマートHR' },
        { id: 'smarthr', name: '株式会社SmartHR' },
      ]}
      currentTenantId="smarthr"
      onTenantSelect={(id) => console.log(id)}
      launcher={launcher}
    >
      <HeaderLink href="https://support.smarthr.jp/" prefix={<FaQuestionCircleIcon />}>
        ヘルプ
      </HeaderLink>
      <HeaderLink href="https://support.smarthr.jp/">リリースノート</HeaderLink>
      <HeaderDropdownButton label="アプリ" prefix={<FaToolboxIcon />}>
        <Button>ログアウト</Button>
      </HeaderDropdownButton>
      <HeaderDropdownButton label="info@example.com">
        <Button>ログアウト</Button>
      </HeaderDropdownButton>
    </Header>
  </Stack>
)

const launcher = {
  apps: {
    base: [
      {
        label: 'hoge',
        url: 'hoge',
      },
    ],
    roumu: [
      {
        label: 'hoge',
        url: 'hoge',
      },
    ],
    jinmane: [
      {
        label: 'hoge',
        url: 'hoge',
      },
    ],
    renkei: [
      {
        label: 'hoge',
        url: 'hoge',
      },
    ],
    plus: [
      {
        label: 'hoge',
        url: 'hoge',
      },
    ],
  },
  urlToShowAll: 'hoge',
}
