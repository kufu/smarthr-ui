import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

import type { Slice } from '@tiptap/pm/model'

const openStartNode = ({ content, openStart }: Slice) => {
  let node = content.firstChild

  for (let depth = 1; depth < openStart && node; depth++) node = node.firstChild

  return node
}

/**
 * ProseMirror の貼り付けに任せないのは、空のブロックへ同じ型のブロックを貼ると、属性を貼った側か今の側の一方から丸ごと取るため。
 * 段落は中身だけを流し込んで貼った側の揃え・行送り・帯を捨て、見出しは属性が違うと丸ごと置き換えて今の側の帯などを捨てる。
 * 既定値（null）で上書きしないのは、プレーンなテキストを貼ると空のブロックに付けておいた書式が消えるため。
 *
 * transformPasted で切り口を閉じて丸ごと置き換えさせないのは、ドロップでも呼ばれ、そのときの選択は落とす先ではないため
 */
export const PasteIntoEmptyTextblock = Extension.create({
  name: 'pasteIntoEmptyTextblock',
  // 既定の優先度にしないのは、画像やリンクの貼り付けより先に受け取り、それらを止めてしまうため
  priority: 1,

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view, _event, slice) => {
            const { selection } = view.state
            const target = selection.$from.parent
            const pasted = slice.openStart > 0 ? openStartNode(slice) : null

            if (
              !selection.empty ||
              !target.isTextblock ||
              target.content.size > 0 ||
              pasted?.type !== target.type
            ) {
              return false
            }

            const tr = view.state.tr.replaceSelection(slice)
            const pos = tr.mapping.map(selection.$from.before())
            const node = tr.doc.nodeAt(pos)
            const attrs = { ...target.attrs }

            for (const [name, value] of Object.entries(pasted.attrs)) {
              if (value !== null) attrs[name] = value
            }

            if (node?.type !== target.type || node.hasMarkup(target.type, attrs)) return false

            // 印を省かないのは、Tiptap の貼り付けルールが uiEvent で貼り付けを見分けるため
            view.dispatch(
              tr
                .setNodeMarkup(pos, undefined, attrs)
                .scrollIntoView()
                .setMeta('paste', true)
                .setMeta('uiEvent', 'paste'),
            )

            return true
          },
        },
      }),
    ]
  },
})
