'use client'

import { type MouseEvent, createContext, useId, useMemo, useState } from 'react'

import { useLatest } from '../../../hooks/useLatest'

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

export const useDrawerContextValue = ({
  isOpen,
  onClickClose,
  ariaLabel,
  ariaLabelledby,
}: {
  isOpen: boolean
  onClickClose?: (e?: MouseEvent<HTMLButtonElement>) => void
  ariaLabel?: string
  ariaLabelledby?: string
}) => {
  const headingId = useId()
  // 常に headingId を指すと、ヘッダ無しのときに参照先が存在しない属性になる
  const [registeredHeadingId, setRegisteredHeadingId] = useState<string | undefined>(undefined)
  const latest = useLatest({ isOpen, onClickClose, headingId })

  // 閉じアニメーション中も DOM に残るため、isOpen を見ないと再度コールバックが走る。
  // また開閉やドラッグで作り直すと DrawerHeader まで巻き込むため、latest 経由で参照する
  const contextValue = useMemo<DrawerContextType>(
    () => ({
      handleClickClose: (e) => {
        if (latest.isOpen) {
          latest.onClickClose?.(e)
        }
      },
      headingId: latest.headingId,
      registerHeadingId: setRegisteredHeadingId,
    }),
    [latest],
  )

  return {
    contextValue,
    resolvedLabelledby: ariaLabel ? undefined : (ariaLabelledby ?? registeredHeadingId),
  }
}
