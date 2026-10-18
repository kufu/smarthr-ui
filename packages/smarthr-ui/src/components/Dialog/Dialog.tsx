import { DialogContent } from './DialogContent'
import { DialogPortal } from './DialogPortal'

import type { DialogProps } from './types'
import type { SHRComponentPropsWithRef } from '../../types'
import type { FC } from 'react'

type Props = SHRComponentPropsWithRef<typeof DialogContent, DialogProps, { omit: 'focusTrapRef' }>

export const Dialog: FC<Props> = ({ className, portalParent, id, ...rest }) => (
  <DialogPortal id={id} parent={portalParent}>
    <DialogContent {...rest} className={className} />
  </DialogPortal>
)
