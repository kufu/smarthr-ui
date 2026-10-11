import { Plugin } from '@tiptap/pm/state'

import type { AnyExtension } from '@tiptap/core'
import type { Transaction } from '@tiptap/pm/state'

const AUTO_TRAILING_NODE_META = 'richTextEditorAutoTrailingNode'

/**
 * 標準はキャレットを動かすだけの transaction にも段落を足すため、末尾が表やリストの
 * 文書を開いてクリックしただけで onChange と取り消し履歴が出る。読み込み時に足しておく
 * 方法は採らない。未編集でも出力に空の段落が付き、保存データの差分になるため。
 *
 * 利用者の編集に続いて足されたものは、その編集と一緒に取り消せるよう履歴に残す。
 *
 * 編集できないときは足さない。段落はキャレットを置く場所のためのもので、readOnly で
 * フォーカスしただけの文書に空行が増え、getJSON の結果まで変わるため。
 */
export const patchTrailingNode = (extension: AnyExtension): AnyExtension => {
  if (extension.name !== 'trailingNode') return extension

  return extension.extend({
    addProseMirrorPlugins() {
      const { editor } = this

      return (this.parent?.() ?? []).map(
        (plugin) =>
          new Plugin({
            ...plugin.spec,
            appendTransaction: (transactions, oldState, newState) => {
              if (!editor.isEditable) return null

              const tr = plugin.spec.appendTransaction?.(transactions, oldState, newState)

              if (!tr || transactions.some((transaction) => transaction.docChanged)) return tr

              return tr.setMeta('addToHistory', false).setMeta(AUTO_TRAILING_NODE_META, true)
            },
          }),
      )
    },
  })
}

export const isAutoTrailingNodeOnly = (
  transaction: Transaction,
  appendedTransactions: readonly Transaction[],
) =>
  !transaction.docChanged &&
  appendedTransactions.every((tr) => !tr.docChanged || tr.getMeta(AUTO_TRAILING_NODE_META))
