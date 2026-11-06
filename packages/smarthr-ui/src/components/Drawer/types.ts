import type { DrawerContent } from './client'
import type { ExtendElementPropsWithRef, ExtendProps } from '../../types'

export type DrawerPosition = 'right' | 'left' | 'bottom'

export type DrawerModality = 'modal' | 'modeless'

export type ControlledDrawerProps = ExtendElementPropsWithRef<
  typeof DrawerContent,
  {
    /** ポータルのラッパー要素に付与する id。role="dialog" の要素ではない点は Dialog と同じ */
    id?: string
    /**
     * DOM 上でドロワーの要素を追加する親要素。
     * ドロワーのマウントと同時に確定していない要素（例: ドロワーの祖先要素の ref）を
     * 渡すと、その要素がまだ DOM に存在しない可能性があるため意図通りに動作しない。
     * 呼び出し側で要素が確定してから渡すこと。
     *
     * modeless の right / left では、コンテナの端に寄せたまま、ページをスクロールしても画面の上端に張り付き、
     * フッターは画面の下端に残る。パネルの高さはウィンドウの高さまでに抑えるため、ページ全体がスクロールする
     * 画面を前提とする。コンテナとその祖先に overflow: hidden があると張り付かないため、コンテナの角丸に
     * 合わせて切り抜くときは overflow: clip を使うこと。画面の上端に固定されるヘッダーがあると、パネルはその裏に潜る。
     */
    portalParent?: HTMLElement
  },
  { omit: 'hasPortalParent' | 'handleClose' }
>

export type DrawerProps = ExtendProps<
  ControlledDrawerProps,
  {
    /** RemoteDrawerTrigger の targetId に同じ値を指定する。ポータルのラッパー要素の id になる */
    id: string
    /**
     * DOM 上でドロワーの要素を追加する親要素。表示は指定しないときと同じく画面全体を覆う。
     * ドロワーのマウントと同時に確定していない要素（例: ドロワーの祖先要素の ref）を
     * 渡すと、その要素がまだ DOM に存在しない可能性があるため意図通りに動作しない。
     * 呼び出し側で要素が確定してから渡すこと。
     */
    portalParent?: HTMLElement
    /**
     * DrawerHeader の閉じるボタン押下時と、bottom の grabber をドラッグして閉じたとき。
     * 未指定なら閉じる。指定すると、渡された close を呼ぶまで閉じない
     */
    onClickClose?: (close: () => void) => void
    /** Escape 押下時。未指定なら閉じる。指定すると、渡された close を呼ぶまで閉じない */
    onPressEscape?: (close: () => void) => void
    /** オーバーレイ押下時。未指定なら閉じない。指定すると、渡された close を呼べば閉じる */
    onClickOverlay?: (close: () => void) => void
    /** 開閉のたびに、次のフレームで呼ばれる */
    onToggle?: (isOpen: boolean) => void
    /** 開いたとき、次のフレームで呼ばれる */
    onOpen?: () => void
    /** 閉じたとき、次のフレームで呼ばれる */
    onClose?: () => void
  },
  { omit: 'isOpen' | 'modality' }
>
