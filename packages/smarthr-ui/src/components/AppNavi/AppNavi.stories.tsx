import { action } from '@storybook/addon-actions'
import React, { type FC, type ReactNode } from 'react'

import { AnchorButton, Button } from '../Button'
import { DropdownMenuGroup } from '../Dropdown/DropdownMenuButton'

import { AppNavi } from './AppNavi'
import { AppNaviAnchor } from './AppNaviAnchor'
import { AppNaviButton } from './AppNaviButton'
import { AppNaviCustomTag } from './AppNaviCustomTag'
import { AppNaviDropdownMenuButton } from './AppNaviDropdownMenuButton'

import type { StoryFn } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/AppNavi',
  component: AppNavi,
}

const Link: FC<{ to: string; children: ReactNode; disabled?: boolean; className?: string }> = ({
  to,
  children,
  disabled = false,
  className = '',
  ...props
}) => (
  <a {...props} {...(disabled ? {} : { href: to })} className={className}>
    {children}
  </a>
)

export const Default: StoryFn = () => (
  <AppNavi label="機能名">
    <AppNaviButton onClick={action('click')} current>
      カレントボタン
    </AppNaviButton>
    <AppNaviAnchor href="/">アンカーボタン</AppNaviAnchor>
    <AppNaviDropdownMenuButton label="設定">
      <Button>権限</Button>
      <AnchorButton href="#">その他</AnchorButton>
      <DropdownMenuGroup name="グループ">
        <Button>権限</Button>
        <AnchorButton href="#">その他</AnchorButton>
      </DropdownMenuGroup>
    </AppNaviDropdownMenuButton>
    <AppNaviCustomTag tag={Link} href="/">
      カスタムタグ
    </AppNaviCustomTag>
    <div className="shr-ms-auto">
      <p>Some child components</p>
    </div>
  </AppNavi>
)

export const CurrentInMenu: StoryFn = () => (
  <AppNavi label="機能名">
    <AppNaviButton onClick={action('click')}>カレントボタン</AppNaviButton>
    <AppNaviAnchor href="/">アンカーボタン</AppNaviAnchor>
    <AppNaviDropdownMenuButton label="設定">
      <Button onClick={action('click')} aria-current="page">
        権限
      </Button>
      <AnchorButton href="#">その他</AnchorButton>
    </AppNaviDropdownMenuButton>
  </AppNavi>
)
CurrentInMenu.storyName = '現在地がDropdownMenu内にある場合'

export const ContainerScrollX: StoryFn = () => (
  <div className="shr-pb-0.25 shr-overflow-x-auto">
    <Default />
  </div>
)
ContainerScrollX.storyName = '横スクロールさせる場合'
