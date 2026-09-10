'use client'

import { createContext } from 'react'

type DrawerContentContextType = {
  onClickClose: () => void
}

// DrawerContentInner が提供する閉じハンドラを DrawerHeader / DrawerCloser に渡すための Context。
// Controlled（Drawer）/ Uncontrolled（DrawerContent）どちらの経路でも Provider が値を流すため、
// 利用者は使い分けを意識せず DrawerHeader / DrawerCloser を配置するだけで閉じ操作が機能する。
export const DrawerContentContext = createContext<DrawerContentContextType>({
  onClickClose: () => {
    /* noop */
  },
})
