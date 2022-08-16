import { Story } from '@storybook/react'
import * as React from 'react'

import { HeadlineArea } from './HeadlineArea'

export default {
  title: 'HeadlineArea',
  component: HeadlineArea,
}

const heading = {
  children: 'HeadlineArea',
}

export const All: Story = () => (
  <HeadlineArea
    heading={heading}
    description="画面説明テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト"
  />
)
All.storyName = 'all'
