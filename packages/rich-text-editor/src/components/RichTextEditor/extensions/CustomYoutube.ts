import { nodePasteRule } from '@tiptap/core'

import { AlignedYoutube } from './AlignedYoutube'
import { normalizeYoutubeUrl } from './youtubeUrl'

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
})
