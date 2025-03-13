'use client'

import React, { type ComponentProps } from 'react'

import { DialogContentInner } from './DialogContentInner'
import { useDialogPortal } from './useDialogPortal'

import type { DialogProps, DirectChildren } from './types'

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
