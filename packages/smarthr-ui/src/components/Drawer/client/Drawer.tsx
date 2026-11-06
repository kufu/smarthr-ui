'use client'

import { type FC, useMemo } from 'react'

import { useRemoteTrigger } from '../../../hooks/client/useRemoteTrigger'
import { useLatest } from '../../../hooks/useLatest'
import { DialogPortal } from '../../Dialog'

import { DrawerContent } from './DrawerContent'

import type { DrawerProps } from '../types'

export const Drawer: FC<DrawerProps> = ({
  id,
  portalParent,
  onClickClose,
  onPressEscape,
  onClickOverlay,
  onToggle,
  onOpen,
  onClose,
  ...rest
}) => {
  const { isOpen, close, handleClickClose, handlePressEscape } = useRemoteTrigger({
    id,
    onClickClose,
    onPressEscape,
    onToggle,
    onOpen,
    onClose,
  })

  const hasOnClickOverlay = !!onClickOverlay
  const latest = useLatest({ onClickOverlay })
  const handleClickOverlay = useMemo(
    () => (hasOnClickOverlay ? () => latest.onClickOverlay?.(close) : undefined),
    [hasOnClickOverlay, close, latest],
  )

  return (
    <DialogPortal id={id} parent={portalParent}>
      <DrawerContent
        {...rest}
        isOpen={isOpen}
        hasPortalParent={Boolean(portalParent)}
        onClickClose={handleClickClose}
        onPressEscape={handlePressEscape}
        onClickOverlay={handleClickOverlay}
        handleClose={close}
      />
    </DialogPortal>
  )
}
