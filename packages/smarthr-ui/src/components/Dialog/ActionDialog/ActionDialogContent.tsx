import React, { HTMLAttributes, useCallback, useContext } from 'react'

import { useId } from '../../../hooks/useId'
import { DialogContentInner } from '../DialogContentInner'
import { DialogContext } from '../DialogWrapper'
import { UncontrolledDialogProps } from '../types'
import { useDialogPortal } from '../useDialogPortal'

import { ActionDialogContentInner, BaseProps } from './ActionDialogContentInner'

type Props = BaseProps &
  UncontrolledDialogProps & {
    /**
     * ダイアログを閉じたときにトリガーとなった要素にフォーカスを返すかどうか
     * defaultで true だが、ステップを持つDialogで次のDialogを起動するなどの場合、falseにする
     */
    returnFocusToTriggerElement?: boolean
  }

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const ActionDialogContent: React.FC<Props & ElementProps> = ({
  children,
  title,
  contentBgColor,
  contentPadding,
  actionText,
  actionTheme,
  onClickAction,
  actionDisabled = false,
  portalParent,
  className = '',
  decorators,
  returnFocusToTriggerElement = true,
  ...props
}) => {
  const { onClickClose, active } = useContext(DialogContext)
  const { createPortal } = useDialogPortal(portalParent)

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

  return createPortal(
    <DialogContentInner
      {...props}
      onPressEscape={onClickClose}
      isOpen={active}
      returnFocusToTriggerElement={returnFocusToTriggerElement}
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
