'use client'

import { DialogContentInner } from './DialogContentInner'
import { useDialogPortal } from './useDialogPortal'

import type { DialogProps, DirectChildren } from './types'
import type { ComponentProps, FC } from 'react'

type AbstractProps = DialogProps & DirectChildren
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

export const Dialog: FC<Props> = ({ className, portalParent, id, ...rest }) => {
  const { createPortal } = useDialogPortal(portalParent, id)

  return createPortal(<DialogContentInner {...rest} className={className} />)
}
