import React, { createContext, useContext } from 'react'

import { DialogContext } from './DialogWrapper'
import { DialogContentInner } from './DialogContentInner'

type DialogContentContextType = {
  onClickClose: () => void
}

export const DialogContentContext = createContext<DialogContentContextType>({
  onClickClose: () => {
    /* noop */
  },
})

type Props = {
  top?: number
  right?: number
  bottom?: number
  left?: number
  ariaLabel?: string
}

export const DialogContent: React.FC<Props> = ({ ariaLabel, children, ...props }) => {
  const { DialogContentRoot, onClickClose, active } = useContext(DialogContext)

  return (
    <DialogContentRoot>
      <DialogContentContext.Provider value={{ onClickClose }}>
        <DialogContentInner
          isOpen={active}
          onClickOverlay={onClickClose}
          onPressEscape={onClickClose}
          ariaLabel={ariaLabel}
          {...props}
        >
          {children}
        </DialogContentInner>
      </DialogContentContext.Provider>
    </DialogContentRoot>
  )
}
