import type { DialogContentInnerProps } from './DialogContentInner'
import type { RefObject } from 'react'

type CommonProps = Pick<
  DialogContentInnerProps,
  'width' | 'size' | 'id' | 'firstFocusTarget' | 'ariaLabel' | 'ariaLabelledby'
>

type ControlledProps = Pick<DialogContentInnerProps, 'isOpen' | 'onClickOverlay' | 'onPressEscape'>

type PortalProps = {
  /**
   * DOM 上でダイアログの要素を追加する親要素
   */
  portalParent?: HTMLElement | RefObject<HTMLElement>
}

export type DialogProps = CommonProps & ControlledProps & PortalProps
export type UncontrolledDialogProps = CommonProps & PortalProps

export type DirectChildren = Pick<DialogContentInnerProps, 'children'>
