import React, { HTMLAttributes, useCallback, useContext } from 'react'

import { UncontrolledDialogProps } from './types'
import { useDialogPortal } from './useDialogPortal'
import { DialogContext } from './DialogWrapper'
import { DialogContentInner } from './DialogContentInner'
import { ActionDialogContentInner, BaseProps } from './ActionDialogContentInner'
import { useId } from '../../hooks/useId'

type Props = Omit<BaseProps, 'titleId'> & UncontrolledDialogProps
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const ActionDialogContent: React.VFC<Props & ElementProps> = ({
  children,
  title,
  closeText,
  actionText,
  actionTheme,
  onClickAction,
  actionDisabled = false,
  portalParent,
  className = '',
  ...props
}) => {
  const { onClickClose, active } = useContext(DialogContext)
  const { Portal } = useDialogPortal(portalParent)

  const handleClickClose = useCallback(() => {
    if (!active) {
      return
    }
    onClickClose()
  }, [active, onClickClose])

  const handleClickAction = useCallback(() => {
    if (!active) {
      return
    }
    onClickAction(onClickClose)
  }, [active, onClickAction, onClickClose])

  const titleId = useId()

  return (
    <Portal>
      <DialogContentInner
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
        isOpen={active}
        ariaLabelledby={titleId}
        className={className}
        {...props}
      >
        <ActionDialogContentInner
          title={title}
          titleId={titleId}
          closeText={closeText}
          actionText={actionText}
          actionTheme={actionTheme}
          onClickAction={handleClickAction}
          onClickClose={handleClickClose}
          actionDisabled={actionDisabled}
        >
          {children}
        </ActionDialogContentInner>
      </DialogContentInner>
    </Portal>
  )
}
