'use client'

import { type FC, type PropsWithChildren, createContext, useCallback, useState } from 'react'

type DrawerContextType = {
  onClickTrigger: () => void
  onClickClose: () => void
  active: boolean
}

const noop = () => undefined
export const DrawerContext = createContext<DrawerContextType>({
  onClickTrigger: noop,
  onClickClose: noop,
  active: false,
})

export const DrawerWrapper: FC<PropsWithChildren> = (props) => {
  const [active, setActive] = useState(false)
  const onClickTrigger = useCallback(() => setActive(true), [])
  const onClickClose = useCallback(() => setActive(false), [])

  return <DrawerContext.Provider {...props} value={{ onClickTrigger, onClickClose, active }} />
}
