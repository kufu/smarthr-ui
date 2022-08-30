import React, { HTMLAttributes } from 'react'

import { DialogProps, DireactChildren } from './types'
import { useDialogPortal } from './useDialogPortal'
import { DialogContentInner } from './DialogContentInner'

type Props = DialogProps & DireactChildren
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const Dialog: React.VFC<Props & ElementProps> = ({
  children,
  className = '',
  portalParent,
  ...props
}) => {
  const { createPortal } = useDialogPortal(portalParent)

  return createPortal(
    <DialogContentInner {...props} className={className}>
      {children}
    </DialogContentInner>,
  )
}
