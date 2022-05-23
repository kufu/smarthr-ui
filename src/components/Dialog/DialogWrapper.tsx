import React, { createContext, useState } from 'react'

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

export const DialogWrapper: React.VFC<{ children?: React.ReactNode }> = ({ children }) => {
  const [active, setActive] = useState(false)

  return (
    <DialogContext.Provider
      value={{
        onClickTrigger: () => setActive(true),
        onClickClose: () => setActive(false),
        active,
      }}
    >
      {children}
    </DialogContext.Provider>
  )
}
