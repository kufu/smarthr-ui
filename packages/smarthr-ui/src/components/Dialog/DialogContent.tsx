'use client'

import { type FC, useContext } from 'react'

import { DialogContentInner } from './DialogContentInner'
import { DialogContext } from './DialogWrapper'
import { useDialogPortal } from './useDialogPortal'

import type { DirectChildren, UncontrolledDialogProps } from './types'

type Props = UncontrolledDialogProps & DirectChildren

export const DialogContent: FC<Props> = ({ portalParent, children, ...rest }) => {
  const { handleDelegateClickClose, active } = useContext(DialogContext)
  const { createPortal } = useDialogPortal(portalParent)

  return createPortal(
    <DialogContentInner {...rest} isOpen={active} onPressEscape={handleDelegateClickClose}>
      {children}
    </DialogContentInner>,
  )
}
