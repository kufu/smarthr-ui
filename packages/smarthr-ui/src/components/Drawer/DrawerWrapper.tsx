'use client'

import { type FC, type PropsWithChildren, createContext, useCallback, useState } from 'react'

type DrawerContextType = {
  handleDelegateClickTrigger: () => void
  handleClickClose: () => void
  active: boolean
}

const noop = () => undefined
export const DrawerContext = createContext<DrawerContextType>({
  handleDelegateClickTrigger: noop,
  handleClickClose: noop,
  active: false,
})

export const DrawerWrapper: FC<PropsWithChildren> = (props) => {
  const [active, setActive] = useState(false)
  const handleDelegateClickTrigger = useCallback(() => setActive(true), [])
  const handleClickClose = useCallback(() => setActive(false), [])

  return (
    <DrawerContext.Provider
      {...props}
      value={{ handleDelegateClickTrigger, handleClickClose, active }}
    />
  )
}
