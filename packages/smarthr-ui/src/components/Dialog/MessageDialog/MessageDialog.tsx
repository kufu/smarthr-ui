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
  MessageDialogContentInner,
  type MessageDialogContentInnerProps,
} from './MessageDialogContentInner'

import type { DialogProps } from '../types'

type AbstractProps = Omit<MessageDialogContentInnerProps, 'heading'> &
  DialogProps & {
    heading: ReactNode | Omit<MessageDialogContentInnerProps['heading'], 'id'>
  }
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

export const MessageDialog: FC<Props & ElementProps> = ({
  heading: orgHeading,
  description,
  onClickClose,
  onPressEscape = onClickClose,
  contentBgColor,
  contentPadding,
  className,
  portalParent,
  decorators,
  id,
  isOpen,
  ...rest
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const handleClickClose = useCallback(() => {
    if (isOpen) {
      onClickClose()
    }
  }, [isOpen, onClickClose])
  const titleId = useId()
  // HINT: ReactNodeとObjectのどちらかを判定
  // typeofはnullの場合もobject判定されてしまうため念の為falsyで判定
  // ReactNodeの一部であるReactElementもobjectとして判定されてしまうためisValidElementで判定
  const heading: MessageDialogContentInnerProps['heading'] =
    !orgHeading || typeof orgHeading !== 'object' || isValidElement(orgHeading)
      ? {
          text: orgHeading as ReactNode,
          id: titleId,
        }
      : ({ ...orgHeading, id: titleId } as MessageDialogContentInnerProps['heading'])

  return createPortal(
    <DialogContentInner
      {...rest}
      isOpen={isOpen}
      ariaLabelledby={titleId}
      className={className}
      onPressEscape={onPressEscape}
    >
      <MessageDialogContentInner
        heading={heading}
        description={description}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        onClickClose={handleClickClose}
        decorators={decorators}
      />
    </DialogContentInner>,
  )
}
