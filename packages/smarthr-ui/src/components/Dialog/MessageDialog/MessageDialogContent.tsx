import { type ComponentProps, type FC, type ReactNode, useCallback, useContext } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { DialogContext } from '../DialogWrapper'
import { useDialogPortal } from '../useDialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import {
  type AbstractProps as ContentInnerProps,
  MessageDialogContentInner,
} from './MessageDialogContentInner'

import type { UncontrolledDialogProps } from '../types'

type ObjectHeadingType = Omit<ContentInnerProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType

type AbstractProps = Omit<ContentInnerProps, 'heading'> &
  UncontrolledDialogProps & {
    heading: HeadingType
  }
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

const headingObjectConverter = (text: ReactNode) => ({
  text,
})

/** @deprecated */
export const MessageDialogContent: FC<Props> = ({
  heading: orgHeading,
  children,
  portalParent,
  className,
  contentBgColor,
  contentPadding,
  decorators,
  ...rest
}) => {
  const { onClickClose, active } = useContext(DialogContext)
  const { createPortal } = useDialogPortal(portalParent)

  const handleClickClose = useCallback(() => {
    if (active) {
      onClickClose()
    }
  }, [active, onClickClose])
  const heading = useObjectHeading<HeadingType, ObjectHeadingType>(
    orgHeading,
    headingObjectConverter,
  )

  return createPortal(
    <DialogContentInner
      {...rest}
      onPressEscape={onClickClose}
      isOpen={active}
      className={className}
      ariaLabelledby={heading.id}
    >
      <MessageDialogContentInner
        heading={heading}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        onClickClose={handleClickClose}
        decorators={decorators}
      >
        {children}
      </MessageDialogContentInner>
    </DialogContentInner>,
  )
}
