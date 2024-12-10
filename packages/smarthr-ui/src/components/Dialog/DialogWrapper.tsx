'use client'

import React, { PropsWithChildren, createContext, useState } from 'react'

type DialogContextType = {
  onClickTrigger: () => void
  onClickClose: () => void
  active: boolean
}

export const DialogContext = createContext<DialogContextType>({
  onClickTrigger: () => {
    /* noop */
  },
  onClickClose: () => {
    /* noop */
  },
  active: false,
})

export const DialogWrapper: React.FC<PropsWithChildren> = (props) => {
  const [active, setActive] = useState(false)

  return (
    <DialogContext.Provider
      {...props}
      value={{
        onClickTrigger: () => setActive(true),
        onClickClose: () => setActive(false),
        active,
      }}
    />
  )
}
