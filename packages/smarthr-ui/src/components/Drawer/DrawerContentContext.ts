'use client'

import { createContext } from 'react'

type DrawerContentContextType = {
  handleClickClose: () => void
}

// Controlled / Uncontrolled どちらの経路でも Provider が値を流すため、
// 利用者は使い分けを意識せず DrawerHeader / DrawerCloser を置くだけでよい。
export const DrawerContentContext = createContext<DrawerContentContextType>({
  handleClickClose: () => {
    /* noop */
  },
})
