import type { DrawerContent } from './client'
import type { ExtendElementPropsWithRef } from '../../types'

export type DrawerPosition = 'right' | 'left' | 'bottom'

export type DrawerModality = 'modal' | 'modeless'

export type DrawerProps = ExtendElementPropsWithRef<
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
  { omit: 'hasPortalParent' }
>
