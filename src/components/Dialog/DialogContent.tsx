import React, { createContext, useContext } from 'react'

import { DireactChildren, UncontrolledDialogProps } from './types'
import { useDialogPortal } from './useDialogPortal'
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

type Props = UncontrolledDialogProps & DireactChildren

export const DialogContent: React.VFC<Props> = ({ portalParent, children, ...props }) => {
  const { onClickClose, active } = useContext(DialogContext)
  const { Portal } = useDialogPortal(portalParent)

  return (
    <Portal>
      <DialogContentContext.Provider value={{ onClickClose }}>
        <DialogContentInner
          isOpen={active}
          onClickOverlay={onClickClose}
          onPressEscape={onClickClose}
          {...props}
        >
          {children}
        </DialogContentInner>
      </DialogContentContext.Provider>
    </Portal>
  )
}
