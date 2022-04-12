import React, { createContext, useMemo, useState } from 'react'

import { useDialogPortal } from './useDialogPortal'

type DialogContextType = {
  onClickTrigger: () => void
  onClickClose: () => void
  DialogContentRoot: React.VFC<{ children: React.ReactNode }>
  active: boolean
}

export const DialogContext = createContext<DialogContextType>({
  onClickTrigger: () => {
    /* noop */
  },
  onClickClose: () => {
    /* noop */
  },
  DialogContentRoot: () => null,
  active: false,
})

export const DialogWrapper: React.VFC<{ children?: React.ReactNode }> = ({ children }) => {
  const [active, setActive] = useState(false)
  const { Portal } = useDialogPortal()

  // This is the root container of a dialog content located in outside the DOM tree
  const DialogContentRoot = useMemo<React.VFC<{ children: React.ReactNode }>>(
    () => (props) => {
      return <Portal>{props.children}</Portal>
    },
    [Portal],
  )
  // set the displayName explicit for DevTools
  DialogContentRoot.displayName = 'DialogContentRoot'

  return (
    <DialogContext.Provider
      value={{
        onClickTrigger: () => setActive(true),
        onClickClose: () => setActive(false),
        DialogContentRoot,
        active,
      }}
    >
      {children}
    </DialogContext.Provider>
  )
}
