import { Story } from '@storybook/react'
import * as React from 'react'

import { HeadlineArea } from './HeadlineArea'

export default {
  title: 'Data Display（データ表示）/HeadlineArea（非推奨）',
  component: HeadlineArea,
}

const heading = {
  children: 'HeadlineArea（非推奨）',
}

export const All: Story = () => (
  <HeadlineArea
    heading={heading}
    description="このコンポーネントの使用は非推奨です。Stackを使って書き換えてください。"
  />
)
All.storyName = 'all'
