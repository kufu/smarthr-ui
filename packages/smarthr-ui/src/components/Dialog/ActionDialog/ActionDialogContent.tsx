'use client'

import { type FC, type HTMLAttributes, useCallback, useContext, useId } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { DialogContext } from '../DialogWrapper'
import { useDialogPortal } from '../useDialogPortal'

import { ActionDialogContentInner, type BaseProps } from './ActionDialogContentInner'

import type { UncontrolledDialogProps } from '../types'

type Props = Omit<BaseProps, 'titleId'> & UncontrolledDialogProps
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const ActionDialogContent: FC<Props & ElementProps> = ({
  children,
  title,
  contentBgColor,
  contentPadding,
  actionText,
  actionTheme,
  onClickAction,
  actionDisabled,
  portalParent,
  className = '',
  decorators,
  ...props
}) => {
  const { onClickClose, active } = useContext(DialogContext)
  const { createPortal } = useDialogPortal(portalParent)

  const handleClickClose = useCallback(() => {
    if (active) {
      onClickClose()
    }
  }, [active, onClickClose])

  const handleClickAction = useCallback(() => {
    if (active) {
      onClickAction(onClickClose)
    }
  }, [active, onClickAction, onClickClose])

  const titleId = useId()

  return createPortal(
    <DialogContentInner
      {...props}
      onPressEscape={onClickClose}
      isOpen={active}
      ariaLabelledby={titleId}
      className={className}
    >
      <ActionDialogContentInner
        title={title}
        titleId={titleId}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        actionText={actionText}
        actionTheme={actionTheme}
        onClickAction={handleClickAction}
        onClickClose={handleClickClose}
        actionDisabled={actionDisabled}
        decorators={decorators}
      >
        {children}
      </ActionDialogContentInner>
    </DialogContentInner>,
  )
}
