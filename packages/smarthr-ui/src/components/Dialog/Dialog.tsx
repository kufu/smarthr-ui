import { DialogContentInner } from './DialogContentInner'
import { DialogPortal } from './DialogPortal'

import type { DialogProps } from './types'
import type { ComponentPropsWithRef, FC, PropsWithChildren } from 'react'

type BaseProps = PropsWithChildren<DialogProps>
type Props = BaseProps &
  Omit<ComponentPropsWithRef<typeof DialogContentInner>, keyof BaseProps | 'focusTrapRef'>

export const Dialog: FC<Props> = ({ className, portalParent, id, ...rest }) => (
  <DialogPortal id={id} parent={portalParent}>
    <DialogContentInner {...rest} className={className} />
  </DialogPortal>
)
