import { DialogPortal } from '../Dialog'

import { DrawerContent } from './client'

import type { DrawerProps } from './types'
import type { FC } from 'react'

export const Drawer: FC<DrawerProps> = ({ portalParent, id, ...rest }) => (
  <DialogPortal id={id} parent={portalParent}>
    <DrawerContent {...rest} hasPortalParent={Boolean(portalParent)} />
  </DialogPortal>
)
