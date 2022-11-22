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
        label: 'hogehoge',
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
  urlToShowAll: 'hogehoge',
}
