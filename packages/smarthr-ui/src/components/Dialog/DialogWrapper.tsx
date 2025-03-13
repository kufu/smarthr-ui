'use client'

import React, { type PropsWithChildren, createContext, useCallback, useState } from 'react'

type DialogContextType = {
  onClickTrigger: () => void
  onClickClose: () => void
  active: boolean
}

const noop = () => undefined
export const DialogContext = createContext<DialogContextType>({
  onClickTrigger: noop,
  onClickClose: noop,
  active: false,
})

export const DialogWrapper: React.FC<PropsWithChildren> = (props) => {
  const [active, setActive] = useState(false)

  const onClickTrigger = useCallback(() => setActive(true), [])
  const onClickClose = useCallback(() => setActive(false), [])

  return (
    <DialogContext.Provider
      {...props}
      value={{
        onClickTrigger,
        onClickClose,
        active,
      }}
    />
  )
}
