import type { DialogContentInnerProps } from './DialogContentInner'

type CommonProps = Pick<
  DialogContentInnerProps,
  'width' | 'size' | 'id' | 'firstFocusTarget' | 'ariaLabel' | 'ariaLabelledby'
>

type ControlledProps = Pick<DialogContentInnerProps, 'isOpen' | 'onClickOverlay' | 'onPressEscape'>

type PortalProps = {
  /**
   * DOM 上でダイアログの要素を追加する親要素。
   * ダイアログのマウントと同時に確定していない要素（例: ダイアログの祖先要素の ref）を
   * 渡すと、その要素がまだ DOM に存在しない可能性があるため意図通りに動作しない。
   * 呼び出し側で要素が確定してから渡すこと。
   */
  portalParent?: HTMLElement
}

export type DialogProps = CommonProps & ControlledProps & PortalProps
export type UncontrolledDialogProps = CommonProps & PortalProps

export type DirectChildren = Pick<DialogContentInnerProps, 'children'>

export type DialogSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'FULL'
