'use client'

import { type FC, useContext } from 'react'

import { useDialogPortal } from '../Dialog'

import { DrawerContentInner } from './DrawerContentInner'
import { DrawerContext } from './DrawerWrapper'

import type { DirectChildren, UncontrolledDrawerProps } from './types'

type Props = UncontrolledDrawerProps & DirectChildren

export const DrawerContent: FC<Props> = ({ portalParent, id, ...rest }) => {
  const { handleClickClose, active } = useContext(DrawerContext)
  const { createPortal } = useDialogPortal(portalParent, id)

  return createPortal(
    <DrawerContentInner
      {...rest}
      hasPortalParent={Boolean(portalParent)}
      isOpen={active}
      onClickClose={handleClickClose}
      onClickOverlay={handleClickClose}
      onPressEscape={handleClickClose}
    />,
  )
}
