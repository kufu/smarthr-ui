import React, { createContext, useContext } from 'react'

import { DialogContentInner } from './DialogContentInner'
import { DialogContext } from './DialogWrapper'
import { DireactChildren, UncontrolledDialogProps } from './types'
import { useDialogPortal } from './useDialogPortal'

type DialogContentContextType = {
  onClickClose: () => void
}

export const DialogContentContext = createContext<DialogContentContextType>({
  onClickClose: () => {
    /* noop */
  },
})

type Props = UncontrolledDialogProps & DireactChildren

export const DialogContent: React.VFC<Props> = ({ portalParent, children, ...props }) => {
  const { onClickClose, active } = useContext(DialogContext)
  const { createPortal } = useDialogPortal(portalParent)

  return createPortal(
    <DialogContentContext.Provider value={{ onClickClose }}>
      <DialogContentInner
        {...props}
        isOpen={active}
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
      >
        {children}
      </DialogContentInner>
    </DialogContentContext.Provider>,
  )
}
