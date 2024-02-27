import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import { userEvent } from '@storybook/testing-library'
import * as React from 'react'

import { Stack } from '../Layout'

import { TabBar } from './TabBar'
import { TabItem } from './TabItem'

export default {
  title: 'Navigation（ナビゲーション）/TabBar',
  component: TabBar,
  subcomponents: { TabItem },
}

export const All: StoryFn = () => (
  <Stack as="ul" className="shr-list-none">
    <li>
      <p>標準</p>
      <Template />
    </li>
    <li>
      <p>下線なし</p>
      <Template bordered={false} />
    </li>
  </Stack>
)

const Template: StoryFn = (props) => (
  <TabBar {...props}>
    <TabItem id="border-1" onClick={action('clicked')} selected>
      基本情報
    </TabItem>
    <TabItem id="border-2" onClick={action('clicked')}>
      コメント
    </TabItem>
    <TabItem id="border-3" onClick={action('clicked')} disabled>
      分析対象
    </TabItem>
  </TabBar>
)

export const RegFocusBorder = All.bind({})
RegFocusBorder.play = () => userEvent.tab()

export const RegFocusNoBorder = All.bind({})
RegFocusNoBorder.play = () => [...Array(3)].forEach((_) => userEvent.tab())
