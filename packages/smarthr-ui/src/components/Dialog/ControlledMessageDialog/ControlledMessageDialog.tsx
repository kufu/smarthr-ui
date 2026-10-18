import {
  type ComponentPropsWithRef,
  type FC,
  type MouseEvent,
  type ReactNode,
  useMemo,
} from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { DialogContent } from '../DialogContent'
import { DialogPortal } from '../DialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import { MessageDialogContent } from './MessageDialogContent'

import type { SHRComponentProps, SHRComponentPropsWithRef } from '../../../types'
import type { DialogProps } from '../types'

type MessageDialogContentProps = ComponentPropsWithRef<typeof MessageDialogContent>
type ObjectHeadingType = Omit<MessageDialogContentProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType

type Props = SHRComponentPropsWithRef<
  typeof DialogContent,
  SHRComponentProps<
    MessageDialogContentProps,
    DialogProps & {
      heading: HeadingType
      onClickClose: (e?: MouseEvent<HTMLButtonElement> | KeyboardEvent) => void
    },
    { omit: 'handleClickClose' }
  >,
  { omit: 'focusTrapRef' }
>

const headingObjectConverter = (text: ReactNode) => ({
  text,
})

export const ControlledMessageDialog: FC<Props> = ({
  heading: orgHeading,
  children,
  onClickClose,
  onPressEscape = onClickClose,
  contentBgColor,
  contentPadding,
  className,
  portalParent,
  closeButton,
  id,
  isOpen,
  ...rest
}) => {
  const heading = useObjectHeading<HeadingType, ObjectHeadingType>(
    orgHeading,
    headingObjectConverter,
  )

  const latest = useLatest({ onClickClose, isOpen })

  const functions = useMemo(
    () => ({
      handleClickClose: (e: MouseEvent<HTMLButtonElement>) => {
        if (latest.isOpen) {
          latest.onClickClose(e)
        }
      },
    }),
    [latest],
  )

  return (
    <DialogPortal id={id} parent={portalParent}>
      <DialogContent
        {...rest}
        isOpen={isOpen}
        className={className}
        ariaLabelledby={heading.id}
        onPressEscape={onPressEscape}
      >
        <MessageDialogContent
          contentBgColor={contentBgColor}
          contentPadding={contentPadding}
          handleClickClose={functions.handleClickClose}
          heading={heading}
          closeButton={closeButton}
        >
          {children}
        </MessageDialogContent>
      </DialogContent>
    </DialogPortal>
  )
}
