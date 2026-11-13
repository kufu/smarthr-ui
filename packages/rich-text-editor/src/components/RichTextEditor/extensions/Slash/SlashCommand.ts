import { Extension } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import { Suggestion, type SuggestionMatch, type Trigger } from '@tiptap/suggestion'

declare module '@tiptap/core' {
  // declaration merging が必要なため interface を使用
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Storage {
    slashCommand?: {
      handleKeyDown: ((event: KeyboardEvent) => boolean) | null
    }
  }
}

export type SlashCommandState = {
  active: boolean
  range: { from: number; to: number }
  query: string | null
}

export const SlashCommandPluginKey = new PluginKey<SlashCommandState>('slashCommand')

// 全角を受けるのは、日本語入力のまま打つと ／ になるため。・ は行頭の手書きの箇条書きと区別できないので受けない
const SLASH_QUERY = /^[/／](\S*)$/

/**
 * 段落の途中や入れ子の中で開かないのは、項目の意味を「この空の行を X に置き換える」の1通りにするため
 */
const findSlashMatch = ({ $position }: Trigger): SuggestionMatch => {
  const paragraph = $position.parent

  if ($position.depth !== 1 || paragraph.type.name !== 'paragraph') return null
  if ($position.parentOffset !== paragraph.content.size) return null

  let plainText = true

  paragraph.forEach((child) => {
    if (!child.isText || child.marks.some((mark) => mark.type.spec.code)) plainText = false
  })

  const match = plainText ? SLASH_QUERY.exec(paragraph.textContent) : null

  if (!match) return null

  return {
    range: { from: $position.start(), to: $position.pos },
    query: match[1],
    text: match[0],
  }
}

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addStorage() {
    return {
      handleKeyDown: null,
    }
  },

  addProseMirrorPlugins() {
    const { editor } = this

    return [
      Suggestion({
        editor,
        pluginKey: SlashCommandPluginKey,
        char: '/',
        findSuggestionMatch: findSlashMatch,
        // 受け口が無い（hideToolbar などでメニューを描いていない）間に開くと、見えないメニューのために Esc を奪う
        allow: () => editor.isEditable && Boolean(editor.storage.slashCommand?.handleKeyDown),
        render: () => ({
          onKeyDown: ({ view, event }) => {
            // Suggestion は開いている間の Esc を修飾キーや変換中かに関わらず閉じるのに使い、
            // preventDefault しか呼ばれない。smarthr-ui の Dialog は document で Esc を待ち、
            // defaultPrevented を見ないので、止めないとメニューと一緒に閉じる
            if (event.key === 'Escape') {
              event.stopPropagation()

              return true
            }

            if (view.composing || event.isComposing) return false

            return editor.storage.slashCommand?.handleKeyDown?.(event) ?? false
          },
        }),
      }),
    ]
  },
})
