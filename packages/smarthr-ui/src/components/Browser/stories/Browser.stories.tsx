import React, { useState } from 'react'

import { Browser } from '../Browser'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Browser',
  component: Browser,
  render: (args) => {
    const [value, setValue] = useState<string | undefined>('department_2')
    return <Browser {...args} value={value} onSelectItem={setValue} />
  },
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Browser>

export const Playground: StoryObj<typeof Browser> = {
  args: {
    value: 'department_2',
    items: [
      {
        value: 'basic',
        label: '標準従業員項目',
        children: [
          { value: 'gender', label: '戸籍上の性別' },
          { value: 'job_title', label: '役職' },
          { value: 'grade', label: '等級' },
          { value: 'employment_type', label: '雇用形態' },
          { value: 'age', label: '年齢' },
          { value: 'service_year', label: '勤続年数' },
          {
            value: 'department',
            label: '部署',
            children: [
              { value: 'department_1', label: '部署階層1' },
              { value: 'department_2', label: '部署階層2' },
              { value: 'department_3', label: '部署階層3' },
              { value: 'department_4', label: '部署階層4' },
              { value: 'department_5', label: '部署階層5' },
              { value: 'department_6', label: '部署階層6' },
              { value: 'department_last', label: '部署最終階層' },
            ],
          },
        ],
      },
      {
        value: 'custom',
        label: 'カスタム従業員項目',
        children: [
          { value: 'custom_1', label: 'カスタム項目1' },
          { value: 'custom_2', label: 'カスタム項目2' },
        ],
      },
      {
        value: 'evaluation',
        label: '人事評価',
        children: [{ value: 'latest_evaluation', label: '最終評価' }],
      },
    ],
  },
}

export const Empty: StoryObj<typeof Browser> = {
  name: 'empty',
  args: {
    items: [],
  },
}
