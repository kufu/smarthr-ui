import { Extension } from '@tiptap/core'

import type { DropdownAnchor } from '../hooks/useToolbarDropdown'

export const INSERT_DIALOG_KINDS = ['image', 'youtube', 'video'] as const

export type InsertDialogKind = (typeof INSERT_DIALOG_KINDS)[number]

export type InsertDialogOpener = (anchor: DropdownAnchor) => void

declare module '@tiptap/core' {
  // declaration merging が必要なため interface を使用
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Storage {
    insertDialogs?: {
      openers: Partial<Record<InsertDialogKind, InsertDialogOpener>>
    }
  }
}

/**
 * ダイアログをボタンから切り離して共有しないのは、検証・フォーカスの管理・閉じる条件を
 * ボタンの1か所に保つため
 */
export const InsertDialogs = Extension.create({
  name: 'insertDialogs',

  addStorage() {
    return {
      openers: {},
    }
  },
})
