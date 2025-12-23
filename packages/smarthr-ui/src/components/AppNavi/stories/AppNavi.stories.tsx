
import { AnchorButton, Button } from '../../Button'
import { DropdownMenuGroup } from '../../Dropdown'
import { FaArrowsRotateIcon } from '../../Icon'
import { Cluster } from '../../Layout'
import { Text } from '../../Text'
import { AppNavi } from '../AppNavi'
import { AppNaviAnchor } from '../AppNaviAnchor'
import { AppNaviButton } from '../AppNaviButton'
import { AppNaviCustomTag } from '../AppNaviCustomTag'
import { AppNaviDropdownMenuButton } from '../AppNaviDropdownMenuButton'

import type { Meta, StoryFn, StoryObj } from '@storybook/react-webpack5'
import type { FC, ReactNode } from 'react'

const Link: FC<{
  to: string
  children: ReactNode
  disabled?: boolean
  className?: string
}> = ({ to, children, disabled = false, className = '', ...rest }) => (
  <a {...rest} {...(disabled ? {} : { href: to })} className={className}>
    {children}
  </a>
)

export const Template: StoryFn<typeof AppNavi> = (args) => (
  <AppNavi {...args}>
    <AppNaviButton>ボタン</AppNaviButton>
    <AppNaviAnchor href="/">アンカーボタン</AppNaviAnchor>
    <AppNaviDropdownMenuButton label="ドロップダウンボタン">
      <Button>ボタン</Button>
      <AnchorButton href="#">アンカーボタン</AnchorButton>
      <DropdownMenuGroup name="グループ">
        <Button aria-current="page">権限</Button>
        <AnchorButton href="#">その他</AnchorButton>
      </DropdownMenuGroup>
    </AppNaviDropdownMenuButton>
    <AppNaviCustomTag tag={Link} href="/">
      カスタムタグ
    </AppNaviCustomTag>
  </AppNavi>
)

export default {
  title: 'Components/AppNavi',
  component: AppNavi,
  render: Template,
  argTypes: {
    label: { control: 'text' },
    buttons: { name: 'buttons（非推奨）' },
    displayDropdownCaret: { name: 'displayDropdownCaret（非推奨）' },
  },
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  excludeStories: ['Template'],
} satisfies Meta<typeof AppNavi>

export const Playground: StoryObj<typeof AppNavi> = {}

export const Label: StoryObj<typeof AppNavi> = {
  name: 'label',
  args: {
    label: '機能名',
  },
}

export const AdditionalArea: StoryObj<typeof AppNavi> = {
  name: 'additionalArea',
  args: {
    additionalArea: (
      <Cluster align="center">
        <Text size="S">最終同期： 2024/11/21 10:13</Text>
        <Button size="s" prefix={<FaArrowsRotateIcon />}>
          データを同期
        </Button>
      </Cluster>
    ),
  },
}
