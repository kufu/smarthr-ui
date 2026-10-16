import { Extension } from '@tiptap/core'
import { NodeSelection } from '@tiptap/pm/state'

declare module '@tiptap/core' {
  // declaration merging が必要なため interface を使用
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Storage {
    mediaToolbarShortcut?: {
      focusToolbar: Partial<Record<string, () => void>>
    }
  }
}

/**
 * 画像・YouTube を選んでいるとき、Alt+Enter / Shift+F10 で操作バーへ移る。
 *
 * 操作バーはエディタの後ろにあり、Tab では本文の動画プレーヤーなどを経由しないと届かない。
 * 表の操作メニューと同じキーにして、覚えることを増やさない。
 */
export const MediaToolbarShortcut = Extension.create({
  name: 'mediaToolbarShortcut',

  // 表のセルの中の画像を選んでいるときは、表のメニューより画像の操作バーを開く
  priority: 1000,

  addStorage() {
    return {
      focusToolbar: {},
    }
  },

  addKeyboardShortcuts() {
    const focusToolbar = () => {
      const { selection } = this.editor.state

      if (!(selection instanceof NodeSelection)) return false

      const handler =
        this.editor.storage.mediaToolbarShortcut?.focusToolbar[selection.node.type.name]

      if (!handler) return false

      handler()

      return true
    }

    return {
      'Alt-Enter': focusToolbar,
      'Shift-F10': focusToolbar,
    }
  },
})
