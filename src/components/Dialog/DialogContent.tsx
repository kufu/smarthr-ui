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
  ariaLabelledby?: string
}

export const DialogContent: React.FC<Props> = ({
  ariaLabel,
  ariaLabelledby,
  children,
  ...props
}) => {
  const { DialogContentRoot, onClickClose, active } = useContext(DialogContext)

  return (
    <DialogContentRoot>
      <DialogContentContext.Provider value={{ onClickClose }}>
        <DialogContentInner
          isOpen={active}
          onClickOverlay={onClickClose}
          onPressEscape={onClickClose}
          ariaLabel={ariaLabel}
          ariaLabelledby={ariaLabelledby}
          {...props}
        >
          {children}
        </DialogContentInner>
      </DialogContentContext.Provider>
    </DialogContentRoot>
  )
}
