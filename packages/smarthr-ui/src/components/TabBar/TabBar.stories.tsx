import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import { userEvent } from '@storybook/test'
import React from 'react'

import { Badge } from '../Badge'
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
      <Template subid={1} />
    </li>
    <li>
      <p>下線なし</p>
      <Template subid={2} bordered={false} />
    </li>
  </Stack>
)

const Template: StoryFn = ({ subid, ...props }) => (
  <TabBar {...props}>
    <TabItem id={`border-${subid}-1`} onClick={action('clicked')} selected>
      基本情報
    </TabItem>
    <TabItem id={`border-${subid}-2`} onClick={action('clicked')} suffix={<Badge count={7} />}>
      コメント
    </TabItem>
    <TabItem
      id={`border-${subid}-3`}
      onClick={action('clicked')}
      disabled
      disabledDetail={{ message: 'この機能は使用できません。' }}
    >
      分析対象
    </TabItem>
  </TabBar>
)

export const RegFocusBorder = All.bind({})
RegFocusBorder.play = () => userEvent.tab()

export const RegFocusNoBorder = All.bind({})
RegFocusNoBorder.play = () => [...Array(4)].forEach((_) => userEvent.tab())
