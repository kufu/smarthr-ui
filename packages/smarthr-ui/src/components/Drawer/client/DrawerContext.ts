'use client'

import { type MouseEvent, createContext } from 'react'

type DrawerContextType = {
  handleClickClose: (e?: MouseEvent<HTMLButtonElement>) => void
  /** DrawerHeader が id 未指定のときに使う自動生成 id */
  headingId: string
  /** DrawerHeader が実際に適用した id。有無ではなく id を登録させるのは、id 指定にも対応するため */
  registerHeadingId: (id: string | undefined) => void
}

export const DrawerContext = createContext<DrawerContextType>({
  handleClickClose: () => {
    /* noop */
  },
  headingId: '',
  registerHeadingId: () => {
    /* noop */
  },
})
