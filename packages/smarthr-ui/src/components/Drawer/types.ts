import type { DrawerSize } from './drawerSize'
import type { PropsWithChildren, ReactNode, RefObject } from 'react'

export type DrawerPosition = 'right' | 'left' | 'bottom' | 'top'

export type DrawerVariant = 'modal' | 'modeless'

export type DrawerCommonProps = {
  /** スライドする方向。既定は 'right' */
  position?: DrawerPosition
  /** right/left の幅。bottom/top では無視される */
  size?: DrawerSize
  /**
   * bottom/top の高さスナップ段階（縦方向のみ有効）。
   * 0〜1 の比率（viewport 高さに対する割合）または `'200px'` `'60dvh'` などの CSS 長さ。
   * 昇順で渡す（小さいほど閉じ寄り）。
   */
  snapPoints?: Array<number | string>
  /** 初期スナップ位置（snapPoints の値のいずれか）。未指定なら最大スナップ */
  defaultSnapPoint?: number | string
  /** aria-label（ariaLabelledby と排他で必須） */
  ariaLabel?: string
  /** aria-labelledby（ariaLabel と排他で必須） */
  ariaLabelledby?: string
  /** 開いたときに最初にフォーカスする要素（'modal' のみ有効） */
  firstFocusTarget?: RefObject<HTMLElement>
  /**
   * モーダル/非モーダルの切り替え。既定は 'modal'。
   * 'modeless' ではオーバーレイ無し・背後操作可（スクロールロック無し・フォーカストラップ無し・aria-modal 無し）。
   */
  variant?: DrawerVariant
}

export type DrawerControlledProps = {
  /** 開いているかどうか */
  isOpen: boolean
  /** 閉じるボタン押下時 */
  onClickClose?: () => void
  /** オーバーレイクリック時 */
  onClickOverlay?: () => void
  /** Escape 押下時 */
  onPressEscape?: () => void
}

export type DrawerPortalProps = {
  /** Portal の追加先 */
  portalParent?: HTMLElement | RefObject<HTMLElement>
  /** ルート要素の id */
  id?: string
}

export type DrawerProps = DrawerCommonProps &
  DrawerControlledProps &
  DrawerPortalProps &
  PropsWithChildren

export type UncontrolledDrawerProps = DrawerCommonProps & DrawerPortalProps & PropsWithChildren

export type DirectChildren = { children?: ReactNode }
