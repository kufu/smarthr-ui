import { DialogContentInner } from './DialogContentInner'
import { DialogPortal } from './DialogPortal'

import type { DialogProps } from './types'
import type { SHRComponentPropsWithRef } from '../../types'
import type { FC } from 'react'

type Props = SHRComponentPropsWithRef<
  typeof DialogContentInner,
  DialogProps,
  { omit: 'focusTrapRef' }
>

export const Dialog: FC<Props> = ({ className, portalParent, id, ...rest }) => (
  <DialogPortal id={id} parent={portalParent}>
    <DialogContentInner {...rest} className={className} />
  </DialogPortal>
)
