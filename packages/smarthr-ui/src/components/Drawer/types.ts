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
     */
    portalParent?: HTMLElement
  },
  { omit: 'hasPortalParent' }
>
