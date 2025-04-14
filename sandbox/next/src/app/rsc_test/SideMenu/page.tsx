import React from 'react'
import { SideMenu, SideMenuGroup, SideMenuItem } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'

export default function SideMenuPage() {
  return (
    <>
      <RSCChecker actualComponent={SideMenu} />

      <SideMenu>
        <SideMenuGroup title="個人設定">
          <SideMenuItem href="#">アカウント</SideMenuItem>
          <SideMenuItem href="#" current>
            認証設定
          </SideMenuItem>
        </SideMenuGroup>

        <SideMenuGroup title="共通設定">
          <SideMenuItem href="#">評価項目の表示設定</SideMenuItem>
          <SideMenuItem href="#">評価対象者の入力必須項目設定</SideMenuItem>
        </SideMenuGroup>
      </SideMenu>
    </>
  )
}
