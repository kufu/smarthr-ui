'use client'

import { DialogPortal } from '../Dialog'

import { DrawerContentInner } from './DrawerContentInner'

import type { DrawerProps } from './types'
import type { FC } from 'react'

export const Drawer: FC<DrawerProps> = ({ portalParent, id, ...rest }) => {
  return (
    <DialogPortal id={id} parent={portalParent}>
      <DrawerContentInner {...rest} hasPortalParent={Boolean(portalParent)} />
    </DialogPortal>
  )
}
