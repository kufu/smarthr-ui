'use client'

import { type FC, type MouseEvent, useContext, useMemo } from 'react'

import { findDelegateTarget } from '../../libs/delegate'

import { DIALOG_CLOSER_CLASS_NAME } from './DialogCloser'
import { DIALOG_CONTENT_CLASS_NAME, DialogContentInner } from './DialogContentInner'
import { DialogContext } from './DialogWrapper'
import { useDialogPortal } from './useDialogPortal'

import type { DirectChildren, UncontrolledDialogProps } from './types'

type Props = UncontrolledDialogProps & DirectChildren

export const DialogContent: FC<Props> = ({ portalParent, children, ...rest }) => {
  const { handleDelegateClickClose, active } = useContext(DialogContext)
  const { createPortal } = useDialogPortal(portalParent)

  const functions = useMemo(
    () => ({
      handleDelegateClick: (e: MouseEvent<HTMLElement>) => {
        const closer = findDelegateTarget<HTMLElement>(e, `.${DIALOG_CLOSER_CLASS_NAME}`)

        // HINT: Dialogがネストしている場合、もっとも近いDialogだけを閉じる
        if (closer?.closest(`.${DIALOG_CONTENT_CLASS_NAME}`) === e.currentTarget) {
          handleDelegateClickClose()
        }
      },
    }),
    [handleDelegateClickClose],
  )

  return createPortal(
    <DialogContentInner
      {...rest}
      isOpen={active}
      onPressEscape={handleDelegateClickClose}
      onClick={functions.handleDelegateClick}
    >
      {children}
    </DialogContentInner>,
  )
}
