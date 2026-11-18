import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  // declaration merging が必要なため interface を使用
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Storage {
    linkShortcut?: {
      openLinkPopover: (() => void) | null
    }
  }
}

/**
 * Mod-K でリンク挿入ポップオーバーを開く。
 *
 * StarterKit の Link を extend せず独立した拡張にするのは、
 * StarterKit.configure({ link: ... }) で既にオプションを渡しており、
 * そこに extend を重ねると設定の出所が2箇所に分かれて追いにくくなるため。
 */
export const LinkShortcut = Extension.create({
  name: 'linkShortcut',

  addStorage() {
    return {
      openLinkPopover: null,
    }
  },

  addKeyboardShortcuts() {
    const openPopover = () => {
      const handler = this.editor.storage.linkShortcut?.openLinkPopover
      // handler未登録（hideToolbar 等でツールバーが無い）時はショートカットを
      // 握りつぶさず、ブラウザ既定の動作に任せる
      if (!handler) return false

      handler()

      return true
    }

    return {
      // Caps Lock 有効時は event.key が 'K' になり、prosemirror-keymap は
      // 実際の文字からキー名を組み立てるため 'Mod-k' 登録だけではマッチしない。
      // フォールバック（keyCodeベースの解決）も ctrlKey を条件に含まないため
      // Windows/Linux の Ctrl+K + Caps Lock では発動しない。大小両方の登録が必要
      // （Tiptap 本体の Bold/Italic/Underline も同様に大小両方を登録している）。
      'Mod-k': openPopover,
      'Mod-K': openPopover,
    }
  },
})
