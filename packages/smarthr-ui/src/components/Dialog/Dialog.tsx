'use client'

import { DialogContentInner } from './DialogContentInner'
import { useDialogPortal } from './useDialogPortal'

import type { DialogProps } from './types'
import type { ComponentProps, FC, PropsWithChildren } from 'react'

type BaseProps = PropsWithChildren<DialogProps>
type Props = BaseProps & Omit<ComponentProps<'div'>, keyof BaseProps>

export const Dialog: FC<Props> = ({ className, portalParent, id, ...rest }) => {
  const { createPortal } = useDialogPortal(portalParent, id)

  return createPortal(<DialogContentInner {...rest} className={className} />)
}
