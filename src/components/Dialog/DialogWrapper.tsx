import React, { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

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

export const DialogWrapper: React.VFC = ({ children }) => {
  const [active, setActive] = useState(false)
  const element = useRef(document.createElement('div')).current

  useEffect(() => {
    document.body.appendChild(element)

    return () => {
      document.body.removeChild(element)
    }
  }, [element])

  // This is the root container of a dialog content located in outside the DOM tree
  const DialogContentRoot = useMemo<React.VFC<{ children: React.ReactNode }>>(
    () => (props) => {
      return createPortal(props.children, element)
    },
    [element],
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
