import type { DialogContentInner } from './DialogContentInner'
import type { ComponentProps, RefObject } from 'react'

type DialogContentInnerProps = ComponentProps<typeof DialogContentInner>

export type UncontrolledDialogProps = Pick<
  DialogContentInnerProps,
  'width' | 'size' | 'firstFocusTarget' | 'ariaLabel' | 'ariaLabelledby'
> & {
  id?: string
  /**
   * DOM 上でダイアログの要素を追加する親要素
   */
  portalParent?: HTMLElement | RefObject<HTMLElement>
}
export type DialogProps = UncontrolledDialogProps &
  Pick<DialogContentInnerProps, 'isOpen' | 'onClickOverlay' | 'onPressEscape'>

export type DialogSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'FULL'
