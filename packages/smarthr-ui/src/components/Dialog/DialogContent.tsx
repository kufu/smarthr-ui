'use client'

import React, { createContext, useContext } from 'react'

import { DialogContentInner } from './DialogContentInner'
import { DialogContext } from './DialogWrapper'
import { DirectChildren, UncontrolledDialogProps } from './types'
import { useDialogPortal } from './useDialogPortal'

type DialogContentContextType = {
  onClickClose: () => void
}

export const DialogContentContext = createContext<DialogContentContextType>({
  onClickClose: () => {
    /* noop */
  },
})

type Props = UncontrolledDialogProps & DirectChildren

export const DialogContent: React.FC<Props> = ({ portalParent, ...props }) => {
  const { onClickClose, active } = useContext(DialogContext)
  const { createPortal } = useDialogPortal(portalParent)

  return createPortal(
    <DialogContentContext.Provider value={{ onClickClose }}>
      <DialogContentInner {...props} isOpen={active} onPressEscape={onClickClose} />
    </DialogContentContext.Provider>,
  )
}
