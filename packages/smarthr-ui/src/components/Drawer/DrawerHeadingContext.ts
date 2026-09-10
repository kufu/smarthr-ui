'use client'

import { createContext } from 'react'

type DrawerHeadingContextType = {
  /** DrawerHeader が id 未指定のときに使う自動生成 id */
  headingId: string
  /** DrawerHeader が実際に適用した id。有無ではなく id を登録させるのは、id 指定にも対応するため */
  registerHeadingId: (id: string | undefined) => void
}

export const DrawerHeadingContext = createContext<DrawerHeadingContextType>({
  headingId: '',
  registerHeadingId: () => {
    /* noop */
  },
})
