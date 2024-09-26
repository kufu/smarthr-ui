import { StoryFn } from '@storybook/react'
import React from 'react'

import { FaGearIcon } from '../../Icon'

import { SideMenu, SideMenuGroup, SideMenuItem } from '.'

export default {
  title: 'Experimental（実験的）/SideMenu',
  component: SideMenu,
}

export const Default: StoryFn = () => (
  <div className="shr-bg-background shr-p-2 shr-max-w-[15rem]">
    <SideMenu>
      <SideMenuItem href="#">アカウント</SideMenuItem>
      <SideMenuItem href="#" current>
        認証設定
      </SideMenuItem>
      <SideMenuItem href="#">評価項目の表示設定</SideMenuItem>
      <SideMenuItem href="#">評価対象者の入力必須項目設定</SideMenuItem>
    </SideMenu>
  </div>
)

export const Grouped: StoryFn = () => (
  <div className="shr-bg-background shr-p-2 shr-max-w-[15rem]">
    <SideMenu>
      <SideMenuGroup title="個人設定">
        <SideMenuItem href="#">アカウント</SideMenuItem>
        <SideMenuItem href="#" current>
          認証設定
        </SideMenuItem>
      </SideMenuGroup>
      <SideMenuGroup title="共通設定">
        <SideMenuItem href="#" prefix={<FaGearIcon />}>
          評価項目の表示設定
        </SideMenuItem>
        <SideMenuItem href="#" prefix={<FaGearIcon />}>
          評価対象者の入力必須項目設定
        </SideMenuItem>
      </SideMenuGroup>
    </SideMenu>
  </div>
)
