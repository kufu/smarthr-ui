'use client'

import { createContext } from 'react'

type DrawerHeadingContextType = {
  /** DrawerHeader が id 未指定のときに使う自動生成 id */
  headingId: string
  /**
   * DrawerHeader が実際に適用した id を DrawerContentInner へ知らせる。
   * ヘッダを置いていない場合に aria-labelledby が存在しない id を指すのを防ぐため、
   * 「自動 id を使ったか」ではなく「どの id を使ったか」を登録させている。
   */
  registerHeadingId: (id: string | undefined) => void
}

export const DrawerHeadingContext = createContext<DrawerHeadingContextType>({
  headingId: '',
  registerHeadingId: () => {
    /* noop */
  },
})
