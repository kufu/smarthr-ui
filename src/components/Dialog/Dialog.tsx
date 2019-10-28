import React, { createContext, useState, useRef, useEffect } from 'react'
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

export const Dialog: React.FC = ({ children }) => {
  const [active, setActive] = useState(false)
  const element = useRef(document.createElement('div')).current

  useEffect(() => {
    document.body.appendChild(element)

    return () => {
      document.body.removeChild(element)
    }
  }, [element])

  // This is the root container of a dialog content located in outside the DOM tree
  const DialogContentRoot = (props: { children: React.ReactNode }) => {
    if (!active) return null
    return createPortal(props.children, element)
  }

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
