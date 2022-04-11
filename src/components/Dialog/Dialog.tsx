import React, { HTMLAttributes, RefObject } from 'react'

import { useDialogPortal } from './useDialogPortal'
import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'

type Props = DialogContentInnerProps & { portalParent?: HTMLElement | RefObject<HTMLElement> }
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const Dialog: React.VFC<Props & ElementProps> = ({
  children,
  className = '',
  portalParent,
  ...props
}) => {
  const { Portal } = useDialogPortal(portalParent)

  return (
    <Portal>
      <DialogContentInner className={className} {...props}>
        {children}
      </DialogContentInner>
    </Portal>
  )
}
