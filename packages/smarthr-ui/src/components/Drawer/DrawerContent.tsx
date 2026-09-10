'use client'

import { type FC, useContext } from 'react'

import { useDialogPortal } from '../Dialog'

import { DrawerContentInner } from './DrawerContentInner'
import { DrawerContext } from './DrawerWrapper'

import type { DirectChildren, UncontrolledDrawerProps } from './types'

type Props = UncontrolledDrawerProps & DirectChildren

export const DrawerContent: FC<Props> = ({ portalParent, id, ...rest }) => {
  const { onClickClose, active } = useContext(DrawerContext)
  const { createPortal } = useDialogPortal(portalParent, id)

  return createPortal(
    <DrawerContentInner
      {...rest}
      hasPortalParent={Boolean(portalParent)}
      isOpen={active}
      onClickClose={onClickClose}
      onClickOverlay={onClickClose}
      onPressEscape={onClickClose}
    />,
  )
}
