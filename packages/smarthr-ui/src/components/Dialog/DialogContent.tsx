'use client'

import { type FC, createContext, useContext } from 'react'

import { DialogContentInner } from './DialogContentInner'
import { DialogContext } from './DialogWrapper'
import { useDialogPortal } from './useDialogPortal'

import type { DirectChildren, UncontrolledDialogProps } from './types'

type DialogContentContextType = {
  handleDelegateClickClose: () => void
}

export const DialogContentContext = createContext<DialogContentContextType>({
  handleDelegateClickClose: () => {
    /* noop */
  },
})

type Props = UncontrolledDialogProps & DirectChildren

export const DialogContent: FC<Props> = ({ portalParent, ...rest }) => {
  const { handleDelegateClickClose, active } = useContext(DialogContext)
  const { createPortal } = useDialogPortal(portalParent)

  return createPortal(
    <DialogContentContext.Provider value={{ handleDelegateClickClose }}>
      <DialogContentInner {...rest} isOpen={active} onPressEscape={handleDelegateClickClose} />
    </DialogContentContext.Provider>,
  )
}
