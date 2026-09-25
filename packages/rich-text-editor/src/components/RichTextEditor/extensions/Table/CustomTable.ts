import { Table, type TableOptions, TableView } from '@tiptap/extension-table'

import { TABLE_SHORTCUTS } from './tableShortcuts'

import type { TableScope } from './tableTarget'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

class CustomTableView extends TableView {
  constructor(node: ProseMirrorNode, cellMinWidth: number) {
    super(node, cellMinWidth)
    // Chrome の focusable scrollable region 対策: Tab で wrapper にフォーカスが奪われないようにする
    this.dom.setAttribute('tabindex', '-1')
  }
}

declare module '@tiptap/core' {
  // declaration merging が必要なため interface を使用
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Storage {
    table?: {
      openActionsMenu: ((scope?: TableScope) => void) | null
    }
  }
}

/**
 * macOS の Option+Shift+英字は 'Ç' のような別の文字を生むため、prosemirror-keymap は
 * event.key では照合できず keyCode から小文字のキー名を組み立てて再照合する。
 * 'Alt-Shift-C' の登録だけでは 'Shift-Alt-c' と一致せず macOS で発動しない。
 * Windows/Linux は 'C' のまま届くので、大小どちらの登録も必要になる。
 */
const withKeyCaseVariants = (shortcut: string): readonly string[] => {
  const key = shortcut.slice(shortcut.lastIndexOf('-') + 1)

  return key.length === 1 ? [shortcut, shortcut.slice(0, -1) + key.toLowerCase()] : [shortcut]
}

export const CustomTable = Table.extend({
  addOptions(): TableOptions {
    return {
      ...this.parent?.(),
      View: CustomTableView,
    } as TableOptions
  },

  addStorage() {
    return {
      openActionsMenu: null,
    }
  },

  addKeyboardShortcuts() {
    // Tiptap Table 標準のショートカット（Backspace/Delete でのテーブル削除など）を継承し、
    // セル移動と表・行・列・セルの操作メニューをカスタマイズする。
    const parentShortcuts = this.parent?.() ?? {}
    const openActionsMenu = (scope?: TableScope) => () => {
      if (!this.editor.isActive('table')) return false
      const handler = this.editor.storage.table?.openActionsMenu
      if (!handler) return false
      handler(scope)
      return true
    }
    return {
      ...parentShortcuts,
      ...Object.fromEntries(
        Object.entries(TABLE_SHORTCUTS).flatMap(([scope, shortcut]) =>
          withKeyCaseVariants(shortcut).map((key) => [key, openActionsMenu(scope as TableScope)]),
        ),
      ),
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
      'Shift-F10': openActionsMenu(),
    }
  },
})
