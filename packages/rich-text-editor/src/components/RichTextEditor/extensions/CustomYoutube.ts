import { nodePasteRule } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

import { AlignedYoutube } from './AlignedYoutube'
import { normalizeYoutubeUrl } from './youtubeUrl'

import type { EditorView } from '@tiptap/pm/view'

const syncPlayerTabIndex = (view: EditorView) => {
  view.dom.querySelectorAll('div[data-youtube-video] iframe').forEach((iframe) => {
    if (view.editable) {
      iframe.setAttribute('tabindex', '-1')
    } else {
      iframe.removeAttribute('tabindex')
    }
  })
}

/**
 * 標準の貼り付けルールは貼り付けた文字列をそのまま src にするため、
 * 出力側で落ちる表記が保存される。判定の正規表現は拡張のものを使い、src と start を揃える。
 */
export const CustomYoutube = AlignedYoutube.extend({
  addPasteRules() {
    return (this.parent?.() ?? []).map((rule) =>
      nodePasteRule({
        find: rule.find,
        type: this.type,
        // null を返すと埋め込みにせず文字列のまま貼り付けられる
        getAttributes: (match) => normalizeYoutubeUrl(match.input),
      }),
    )
  },

  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() ?? []),
      // 編集中に Tab が動画プレーヤーの中を順にたどると、本文の後ろの操作バーや次の入力欄へ
      // 届かない。出力の HTML には残さないよう、属性ではなく描画後の DOM に付ける
      new Plugin({
        view: (editorView) => {
          let editable = editorView.editable
          syncPlayerTabIndex(editorView)

          return {
            update: (view, prevState) => {
              if (view.state.doc !== prevState.doc || view.editable !== editable) {
                editable = view.editable
                syncPlayerTabIndex(view)
              }
            },
          }
        },
      }),
    ]
  },
})
