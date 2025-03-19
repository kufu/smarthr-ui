'use client'

import { DialogContentInner } from './DialogContentInner'
import { useDialogPortal } from './useDialogPortal'

import type { DialogProps, DirectChildren } from './types'
import type { ComponentProps, FC } from 'react'

type Props = DialogProps & DirectChildren
type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

export const Dialog: FC<Props & ElementProps> = ({ className, portalParent, id, ...props }) => {
  const { createPortal } = useDialogPortal(portalParent, id)

  return createPortal(<DialogContentInner {...props} className={className} />)
}
