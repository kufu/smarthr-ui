import type { AnyExtension } from '@tiptap/core'
import type { EditorState } from '@tiptap/pm/state'

/** 選択位置から祖先を遡り、listItem 型のノードが何段あるかを数える */
const countListItemDepth = (state: EditorState, itemTypeName: string): number => {
  const { $from } = state.selection
  let count = 0

  for (let depth = $from.depth; depth > 0; depth--) {
    if ($from.node(depth).type.name === itemTypeName) {
      count++
    }
  }

  return count
}

/**
 * listItem 拡張の Shift-Tab を差し替える。
 *
 * Tiptap 既定の Shift-Tab は無条件に liftListItem を実行するため、トップレベルの
 * 項目では「リストから外す＝段落に戻す」動作になり、ツールバーへ戻ろうとした
 * キーボード操作のユーザーが書式を失う。ネストしているときだけ1段解除し、
 * それ以外は false を返してブラウザ既定のフォーカス移動に委ねる。
 *
 * ListItem を import して差し替えないのは、@tiptap/extension-list が
 * packages/smarthr-ui の直接依存ではなく（StarterKit 経由の推移的依存のみ）、
 * pnpm では解決できないため。
 */
export const patchListItemShiftTab = (extension: AnyExtension): AnyExtension => {
  if (extension.name !== 'listItem') return extension

  return extension.extend({
    addKeyboardShortcuts() {
      return {
        ...this.parent?.(),
        'Shift-Tab': () => {
          if (countListItemDepth(this.editor.state, this.name) <= 1) return false

          return this.editor.commands.liftListItem(this.name)
        },
      }
    },
  })
}
