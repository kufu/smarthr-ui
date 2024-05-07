import React, { ComponentProps } from 'react'

import { DialogContentInner } from './DialogContentInner'
import { DialogProps, DireactChildren } from './types'
import { useDialogPortal } from './useDialogPortal'

type Props = DialogProps & DireactChildren
type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

export const Dialog: React.FC<Props & ElementProps> = ({
  className,
  portalParent,
  id,
  ...props
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)

  return createPortal(<DialogContentInner {...props} className={className} />)
}
