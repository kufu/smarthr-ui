import { DialogContent } from './DialogContent'
import { DialogPortal } from './DialogPortal'

import type { DialogProps } from './types'
import type { ExtendElementPropsWithRef } from '../../types'
import type { FC } from 'react'

type Props = ExtendElementPropsWithRef<typeof DialogContent, DialogProps, { omit: 'focusTrapRef' }>

export const Dialog: FC<Props> = ({ className, portalParent, id, ...rest }) => (
  <DialogPortal id={id} parent={portalParent}>
    <DialogContent {...rest} className={className} />
  </DialogPortal>
)
