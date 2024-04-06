import { StoryFn } from '@storybook/react'
import React from 'react'

import { SideMenu } from './SideMenu'

export default {
  title: 'Experimental（実験的）/SideMenu',
  component: SideMenu,
  parameters: {
    layout: 'fullscreen',
    withTheming: true,
  },
}

export const Default: StoryFn = () => (
  <div className="shr-bg-background shr-p-2">
    <SideMenu>
      <SideMenu.Group name="基本設定">
        <SideMenu.Item href="#">評価シート</SideMenu.Item>
        <SideMenu.Item href="#" current>
          評価ロール
        </SideMenu.Item>
        <SideMenu.Item href="#">評価フロー</SideMenu.Item>
      </SideMenu.Group>
      <SideMenu.Group name="その他の設定">
        <SideMenu.Item href="#">評価項目の入力必須設定</SideMenu.Item>
        <SideMenu.Item href="#">評価ロールの閲覧・編集権限設定</SideMenu.Item>
        <SideMenu.Item href="#">評価対象者の表示項目設定</SideMenu.Item>
      </SideMenu.Group>
    </SideMenu>
  </div>
)
