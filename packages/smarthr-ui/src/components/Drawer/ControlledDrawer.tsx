import { DialogPortal } from '../Dialog'

import { DrawerContent } from './client'

import type { ControlledDrawerProps } from './types'
import type { FC } from 'react'

export const ControlledDrawer: FC<ControlledDrawerProps> = ({ portalParent, id, ...rest }) => (
  <DialogPortal id={id} parent={portalParent}>
    <DrawerContent {...rest} hasPortalParent={Boolean(portalParent)} />
  </DialogPortal>
)
