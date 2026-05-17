import { Table } from '@tiptap/extension-table'

declare module '@tiptap/core' {
  // declaration merging が必要なため interface を使用
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Storage {
    table?: {
      openActionsMenu: (() => void) | null
    }
  }
}

export const CustomTable = Table.extend({
  addStorage() {
    return {
      openActionsMenu: null,
    }
  },

  addKeyboardShortcuts() {
    // Tiptap Table 標準のショートカット（Backspace/Delete でのテーブル削除など）を継承し、
    // Tab/Shift-Tab/Alt-Enter/Shift-F10 のみカスタマイズする。
    const parentShortcuts = this.parent?.() ?? {}
    return {
      ...parentShortcuts,
      Tab: () => {
        if (!this.editor.isActive('table')) return false
        // セル移動できればtrue、できなければfalseでブラウザのTabデフォルト動作に任せる
        // （最後のセルでの自動行追加は抑止しつつ、Tabでテーブル外へ抜けられるようにする）
        return this.editor.commands.goToNextCell()
      },
      'Shift-Tab': () => {
        if (!this.editor.isActive('table')) return false
        return this.editor.commands.goToPreviousCell()
      },
      'Alt-Enter': () => {
        if (!this.editor.isActive('table')) return false
        const handler = this.editor.storage.table?.openActionsMenu
        // handler未登録（hideToolbar 等で Floating UI が無い）時はショートカットを握りつぶさない
        if (!handler) return false
        handler()
        return true
      },
      'Shift-F10': () => {
        if (!this.editor.isActive('table')) return false
        const handler = this.editor.storage.table?.openActionsMenu
        if (!handler) return false
        handler()
        return true
      },
    }
  },
})
