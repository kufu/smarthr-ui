import {
  type ComponentPropsWithRef,
  type FC,
  type MouseEvent,
  type ReactNode,
  useMemo,
} from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { useObjectAttributes } from '../../../hooks/useObjectAttributes'
import { DialogContentInner } from '../DialogContentInner'
import { DialogPortal } from '../DialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import { ActionDialogContentInner } from './ActionDialogContentInner'

import type { SHRComponentProps, SHRComponentPropsWithRef } from '../../../types'
import type { DialogProps } from '../types'

type ActionDialogContentInnerProps = ComponentPropsWithRef<typeof ActionDialogContentInner>

type ObjectHeadingType = Omit<ActionDialogContentInnerProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType
type ObjectActionButtonType = ActionDialogContentInnerProps['actionButton']
type ObjectCloseButtonType = ActionDialogContentInnerProps['closeButton']

type Props = SHRComponentPropsWithRef<
  typeof DialogContentInner,
  SHRComponentProps<
    ActionDialogContentInnerProps,
    DialogProps & {
      heading: HeadingType
      actionButton: ReactNode | ObjectActionButtonType
      closeButton?: ReactNode | ObjectCloseButtonType
      /**
       * アクションボタンをクリックした時に発火するコールバック関数
       */
      onClickAction: ActionDialogContentInnerProps['handleClickAction']
      /**
       * 閉じるボタンをクリックした時に発火するコールバック関数
       */
      onClickClose: (e?: MouseEvent<HTMLButtonElement> | KeyboardEvent) => void
    },
    { omit: 'handleClickAction' | 'handleClickClose' }
  >,
  { omit: 'focusTrapRef' }
>

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
    const handleClickAction: ActionDialogContentInnerProps['handleClickAction'] = (e, helpers) => {
      if (latest.isOpen) {
        latest.onClickAction(e, helpers)
      }
    }

    return {
      handleClickClose: (e?: MouseEvent<HTMLButtonElement>) => {
        if (latest.isOpen) {
          latest.onClickClose(e)
        }
      },
      handleClickAction,
    }
  }, [latest])

  return (
    <DialogPortal id={id} parent={portalParent}>
      <DialogContentInner
        {...rest}
        isOpen={isOpen}
        className={className}
        ariaLabelledby={heading.id}
        onPressEscape={closeButton.disabled ? undefined : onPressEscape}
      >
        <ActionDialogContentInner
          contentBgColor={contentBgColor}
          contentPadding={contentPadding}
          responseStatus={responseStatus}
          handleClickClose={functions.handleClickClose}
          handleClickAction={functions.handleClickAction}
          heading={heading}
          actionButton={actionButton}
          closeButton={closeButton}
          subActionArea={subActionArea}
        >
          {children}
        </ActionDialogContentInner>
      </DialogContentInner>
    </DialogPortal>
  )
}
