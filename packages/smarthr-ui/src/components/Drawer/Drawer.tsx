'use client'

import { useDialogPortal } from '../Dialog'

import { DrawerContentInner } from './DrawerContentInner'

import type { DrawerProps } from './types'
import type { FC } from 'react'

export const Drawer: FC<DrawerProps> = ({ portalParent, id, ...rest }) => {
  const { createPortal } = useDialogPortal(portalParent, id)

  return createPortal(<DrawerContentInner {...rest} hasPortalParent={Boolean(portalParent)} />)
}
