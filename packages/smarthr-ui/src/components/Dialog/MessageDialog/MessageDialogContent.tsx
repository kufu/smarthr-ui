import {
  type ComponentProps,
  type FC,
  type ReactNode,
  isValidElement,
  useCallback,
  useContext,
  useId,
} from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { DialogContext } from '../DialogWrapper'
import { useDialogPortal } from '../useDialogPortal'

import {
  type AbstractProps as ContentInnerProps,
  MessageDialogContentInner,
} from './MessageDialogContentInner'

import type { UncontrolledDialogProps } from '../types'

type HeadingType = ContentInnerProps['heading']
type AbstractProps = Omit<ContentInnerProps, 'heading'> &
  UncontrolledDialogProps & {
    heading: ReactNode | Omit<HeadingType, 'id'>
  }
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

/** @deprecated */
export const MessageDialogContent: FC<Props> = ({
  heading: orgHeading,
  description,
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
  const titleId = useId()
  // HINT: ReactNodeとObjectのどちらかを判定
  // typeofはnullの場合もobject判定されてしまうため念の為falsyで判定
  // ReactNodeの一部であるReactElementもobjectとして判定されてしまうためisValidElementで判定
  const heading: HeadingType =
    !orgHeading || typeof orgHeading !== 'object' || isValidElement(orgHeading)
      ? {
          text: orgHeading as ReactNode,
          id: titleId,
        }
      : ({ ...orgHeading, id: titleId } as HeadingType)

  return createPortal(
    <DialogContentInner
      {...rest}
      onPressEscape={onClickClose}
      isOpen={active}
      className={className}
      ariaLabelledby={titleId}
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
