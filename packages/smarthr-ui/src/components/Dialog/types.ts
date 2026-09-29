import type { DialogContentInner } from './DialogContentInner'
import type { ComponentProps, RefObject } from 'react'

type DialogContentInnerProps = ComponentProps<typeof DialogContentInner>

type CommonProps = Pick<
  DialogContentInnerProps,
  'width' | 'size' | 'firstFocusTarget' | 'ariaLabel' | 'ariaLabelledby'
> & {
  id?: string
}

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

export type DialogSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'FULL'
