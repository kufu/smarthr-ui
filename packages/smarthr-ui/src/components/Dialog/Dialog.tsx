'use client'

import { DialogContentInner } from './DialogContentInner'
import { DialogPortal } from './DialogPortal'

import type { DialogProps } from './types'
import type { ComponentProps, FC, PropsWithChildren } from 'react'

type BaseProps = PropsWithChildren<DialogProps>
type Props = BaseProps & Omit<ComponentProps<'div'>, keyof BaseProps>

export const Dialog: FC<Props> = ({ className, portalParent, id, ...rest }) => (
  <DialogPortal id={id} parent={portalParent}>
    <DialogContentInner {...rest} className={className} />
  </DialogPortal>
)
