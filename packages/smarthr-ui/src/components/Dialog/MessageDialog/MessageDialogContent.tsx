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

import { type BaseProps, MessageDialogContentInner } from './MessageDialogContentInner'

import type { UncontrolledDialogProps } from '../types'

type Props = Omit<BaseProps, 'heading'> &
  UncontrolledDialogProps & {
    heading: ReactNode | Omit<BaseProps['heading'], 'id'>
  }
type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

/** @deprecated */
export const MessageDialogContent: FC<Props & ElementProps> = ({
  heading: orgHeading,
  description,
  portalParent,
  className,
  contentBgColor,
  contentPadding,
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
  const titleId = useId()
  // HINT: ReactNodeとObjectのどちらかを判定
  // typeofはnullの場合もobject判定されてしまうため念の為falsyで判定
  // ReactNodeの一部であるReactElementもobjectとして判定されてしまうためisValidElementで判定
  const heading: BaseProps['heading'] =
    !orgHeading || typeof orgHeading !== 'object' || isValidElement(orgHeading)
      ? {
          text: orgHeading as ReactNode,
          id: titleId,
        }
      : ({ ...orgHeading, id: titleId } as BaseProps['heading'])

  return createPortal(
    <DialogContentInner
      {...props}
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
