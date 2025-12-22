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
  ...rest
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const handleClickClose = useCallback(() => {
    if (!rest.isOpen) {
      return
    }
    onClickClose()
  }, [onClickClose, rest.isOpen])
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
