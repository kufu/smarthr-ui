'use client'

import { type ComponentProps, type FC, type ReactNode, useMemo } from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { useObjectAttributes } from '../../../hooks/useObjectAttributes'
import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import {
  ActionDialogContentInner,
  type ActionDialogContentInnerProps,
} from './ActionDialogContentInner'

import type { DialogProps } from '../types'

type ObjectHeadingType = Omit<ActionDialogContentInnerProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType
type ObjectActionButtonType = ActionDialogContentInnerProps['actionButton']
type ObjectCloseButtonType = ActionDialogContentInnerProps['closeButton']

type AbstractProps = Omit<
  ActionDialogContentInnerProps,
  'heading' | 'actionButton' | 'closeButton'
> &
  DialogProps & {
    heading: HeadingType
    actionButton: ReactNode | ObjectActionButtonType
    closeButton?: ReactNode | ObjectCloseButtonType
  }
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

const headingObjectConverter = (text: ReactNode) => ({
  text,
})
const buttonObjectConverter = (text: ReactNode) => ({ text })

export const ControlledActionDialog: FC<Props> = ({
  children,
  heading: orgHeading,
  contentBgColor,
  contentPadding,
  actionButton: orgActionButton,
  onClickAction,
  onClickClose,
  onPressEscape = onClickClose,
  responseStatus,
  closeButton: orgCloseButton,
  subActionArea,
  className,
  portalParent,
  id,
  isOpen,
  ...rest
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const heading = useObjectHeading<HeadingType, ObjectHeadingType>(
    orgHeading,
    headingObjectConverter,
  )
  const actionButton = useObjectAttributes<
    ReactNode | ObjectActionButtonType,
    ObjectActionButtonType
  >(orgActionButton, buttonObjectConverter)
  const closeButton = useObjectAttributes<ReactNode | ObjectCloseButtonType, ObjectCloseButtonType>(
    orgCloseButton,
    buttonObjectConverter,
  )

  const latest = useLatest({ onClickClose, onClickAction, isOpen })

  const functions = useMemo(() => {
    const actualOnClickClose = () => {
      if (latest.isOpen) {
        latest.onClickClose()
      }
    }

    return {
      actualOnClickClose,
      actualOnClickAction: (e: React.MouseEvent<Element>) => {
        if (latest.isOpen) {
          latest.onClickAction(e, { close: actualOnClickClose })
        }
      },
    }
  }, [latest])

  return createPortal(
    <DialogContentInner
      {...rest}
      isOpen={isOpen}
      ariaLabelledby={heading.id}
      className={className}
      onPressEscape={closeButton.disabled ? undefined : onPressEscape}
    >
      <ActionDialogContentInner
        heading={heading}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        actionButton={actionButton}
        closeButton={closeButton}
        onClickClose={functions.actualOnClickClose}
        onClickAction={functions.actualOnClickAction}
        subActionArea={subActionArea}
        responseStatus={responseStatus}
      >
        {children}
      </ActionDialogContentInner>
    </DialogContentInner>,
  )
}
