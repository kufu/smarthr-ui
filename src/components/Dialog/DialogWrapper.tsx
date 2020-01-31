import React, { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type DialogContextType = {
  onClickTrigger: () => void
  onClickClose: () => void
  DialogContentRoot: React.FC<{ children: React.ReactNode }>
}

export const DialogContext = createContext<DialogContextType>({
  onClickTrigger: () => {},
  onClickClose: () => {},
  DialogContentRoot: () => null,
})

export const DialogWrapper: React.FC = ({ children }) => {
  const [active, setActive] = useState(false)
  const element = useRef(document.createElement('div')).current

  useEffect(() => {
    document.body.appendChild(element)

    return () => {
      document.body.removeChild(element)
    }
  }, [element])

  // This is the root container of a dialog content located in outside the DOM tree
  const DialogContentRoot = useMemo<React.FC<{ children: React.ReactNode }>>(
    () => props => {
      if (!active) return null
      return createPortal(props.children, element)
    },
    [active, element],
  )
  // set the displayName explicit for DevTools
  DialogContentRoot.displayName = 'DialogContentRoot'

  return (
    <DialogContext.Provider
      value={{
        onClickTrigger: () => setActive(true),
        onClickClose: () => setActive(false),
        DialogContentRoot,
      }}
    >
      {children}
    </DialogContext.Provider>
  )
}
