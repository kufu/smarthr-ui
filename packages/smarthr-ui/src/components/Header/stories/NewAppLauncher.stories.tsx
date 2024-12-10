import React from 'react'

import { backgroundColor } from '../../../themes'
import { NewAppLauncher } from '../NewAppLauncher'

import type { Meta, StoryObj } from '@storybook/react'

const buildFeature = (index: number, name: string, favorite: boolean, position?: number) => ({
  id: `feature-${index}`,
  url: 'https://example.com',
  name,
  favorite,
  position: position ?? null,
})
export default {
  title: 'Navigation（ナビゲーション）/Header/NewAppLauncher',
  component: NewAppLauncher,
  render: (args) => <NewAppLauncher {...args} />,
  args: {
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
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.brand }],
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof NewAppLauncher>

export const Playground: StoryObj<typeof NewAppLauncher> = {}

export const EnableNew: StoryObj<typeof NewAppLauncher> = {
  name: 'enableNew',
  args: {
    enableNew: true,
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.white }],
    },
  },
}
