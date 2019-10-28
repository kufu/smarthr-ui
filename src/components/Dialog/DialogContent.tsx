import React, { createContext, useContext } from 'react'

import { DialogContext } from './Dialog'
import { DialogContentInner } from './DialogContentInner'

type DialogContentContextType = {
  onClickClose: () => void
}

export const DialogContentContext = createContext<DialogContentContextType>({
  onClickClose: () => {},
})

type Props = {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export const DialogContent: React.FC<Props> = ({ children, ...props }) => {
  const { DialogContentRoot, onClickClose } = useContext(DialogContext)

  return (
    <DialogContentRoot>
      <DialogContentContext.Provider value={{ onClickClose }}>
        <DialogContentInner onClickBackground={onClickClose} {...props}>
          {children}
        </DialogContentInner>
      </DialogContentContext.Provider>
    </DialogContentRoot>
  )
}
