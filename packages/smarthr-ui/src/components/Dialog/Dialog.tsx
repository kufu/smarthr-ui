'use client'

import React, { ComponentProps } from 'react'

import { DialogContentInner } from './DialogContentInner'
import { DialogProps, DirectChildren } from './types'
import { useDialogPortal } from './useDialogPortal'

type Props = DialogProps & DirectChildren
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
