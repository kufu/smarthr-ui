'use client'

import {
  type ComponentProps,
  type FC,
  type ReactNode,
  isValidElement,
  useCallback,
  useId,
} from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'

import {
  ActionDialogContentInner,
  type ActionDialogContentInnerProps,
} from './ActionDialogContentInner'

import type { DialogProps } from '../types'

type Props = Omit<ActionDialogContentInnerProps, 'heading'> &
  DialogProps & {
    heading: ReactNode | Omit<ActionDialogContentInnerProps['heading'], 'id'>
  }
type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

export const ActionDialog: FC<Props & ElementProps> = ({
  children,
  heading: orgHeading,
  contentBgColor,
  contentPadding,
  actionText,
  actionTheme,
  onClickAction,
  onClickClose,
  onPressEscape = onClickClose,
  responseStatus,
  actionDisabled,
  closeDisabled,
  subActionArea,
  className,
  portalParent,
  decorators,
  id,
  isOpen,
  ...props
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const titleId = useId()
  // HINT: ReactNodeとObjectのどちらかを判定
  // typeofはnullの場合もobject判定されてしまうため念の為falsyで判定
  // ReactNodeの一部であるReactElementもobjectとして判定されてしまうためisValidElementで判定
  const heading: ActionDialogContentInnerProps['heading'] =
    !orgHeading || typeof orgHeading !== 'object' || isValidElement(orgHeading)
      ? {
          text: orgHeading as ReactNode,
          id: titleId,
        }
      : ({ ...orgHeading, id: titleId } as ActionDialogContentInnerProps['heading'])

  const actualOnClickClose = useCallback(() => {
    if (isOpen) {
      onClickClose()
    }
  }, [isOpen, onClickClose])

  const actualOnClickAction = useCallback(() => {
    if (isOpen) {
      onClickAction(onClickClose)
    }
  }, [isOpen, onClickAction, onClickClose])

  return createPortal(
    <DialogContentInner
      {...props}
      isOpen={isOpen}
      ariaLabelledby={titleId}
      className={className}
      onPressEscape={closeDisabled ? undefined : onPressEscape}
    >
      <ActionDialogContentInner
        heading={heading}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        actionText={actionText}
        actionTheme={actionTheme}
        actionDisabled={actionDisabled}
        closeDisabled={closeDisabled}
        onClickClose={actualOnClickClose}
        onClickAction={actualOnClickAction}
        subActionArea={subActionArea}
        responseStatus={responseStatus}
        decorators={decorators}
      >
        {children}
      </ActionDialogContentInner>
    </DialogContentInner>,
  )
}
