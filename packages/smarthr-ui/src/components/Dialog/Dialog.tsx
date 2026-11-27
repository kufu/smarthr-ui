import { DialogPortal } from '../DialogPortal'

import { DialogContent } from './client'

import type { DialogProps } from './types'
import type { ExtendElementPropsWithRef } from '../../types'
import type { FC } from 'react'

type Props = ExtendElementPropsWithRef<typeof DialogContent, DialogProps, { omit: 'focusTrapRef' }>

export const Dialog: FC<Props> = ({ portalParent, id, ...rest }) => (
  <DialogPortal id={id} parent={portalParent}>
    <DialogContent {...rest} />
  </DialogPortal>
)
