'use client'

import { NodeSelection } from '@tiptap/pm/state'
import { type Editor, useEditorState } from '@tiptap/react'

const canRun = (editor: Editor, command: string): boolean => {
  try {
    return (
      (
        editor.can().chain().focus() as unknown as Record<
          string,
          (() => { run: () => boolean }) | undefined
        >
      )
        [command]?.()
        .run() ?? false
    )
  } catch {
    return false
  }
}

// Tiptap の color/backgroundColor/fontSize は style 未指定の span を parse すると
// `element.style.xxx` が返す空文字をそのまま属性値にする。空文字は「未指定」と同義なので
// null に倒す（renderHTML 側も falsy を未指定として扱っている）。
// parseHTML を上書きして根元で潰す手もあるが、upstream の属性定義を丸ごと自前で抱えることに
// なるため、直接 JSON を渡された場合も含めて値を読む側で正規化する。
const normalizeStyleValue = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null

const readHeadingLevel = (e: Editor): 1 | 2 | 3 | 4 | null =>
  ([1, 2, 3, 4] as const).find((level) => e.isActive('heading', { level })) ?? null

const readBlockAttribute = (e: Editor, name: 'lineHeight' | 'textAlign') =>
  normalizeStyleValue(e.getAttributes('paragraph')[name]) ??
  normalizeStyleValue(e.getAttributes('heading')[name])

export const readers = {
  currentHeadingLevel: readHeadingLevel,
  currentFontSize: (e: Editor) => normalizeStyleValue(e.getAttributes('textStyle').fontSize),
  currentLineHeight: (e: Editor) => readBlockAttribute(e, 'lineHeight'),
  currentTextAlign: (e: Editor) => readBlockAttribute(e, 'textAlign'),
  isInHeading: (e: Editor) => e.isActive('heading'),
  isLink: (e: Editor) => e.isActive('link'),
}

/**
 * ドロップダウンなどが自分の使う値だけを購読する。
 *
 * useEditorState のセレクタは購読者ごとに毎トランザクション実行される。
 * ツールバー全体の状態を各部品で購読すると、使わない canRun のドライランまで
 * 部品の数だけ繰り返すため、必要な値だけを読む。
 */
export const useToolbarValue = <T>(editor: Editor, read: (e: Editor) => T): T =>
  useEditorState({ editor, selector: ({ editor: e }) => read(e) })

/** ツールバー本体のボタンの押下状態と、押せるかどうか */
export const useToolbarState = (editor: Editor) =>
  useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      isBold: e.isActive('bold'),
      isItalic: e.isActive('italic'),
      isStrike: e.isActive('strike'),
      isUnderline: e.isActive('underline'),
      isCode: e.isActive('code'),
      isCodeBlock: e.isActive('codeBlock'),
      isBulletList: e.isActive('bulletList'),
      isOrderedList: e.isActive('orderedList'),
      isBlockquote: e.isActive('blockquote'),
      isInHeading: readers.isInHeading(e),

      canBold: canRun(e, 'toggleBold'),
      canItalic: canRun(e, 'toggleItalic'),
      canStrike: canRun(e, 'toggleStrike'),
      canUnderline: canRun(e, 'toggleUnderline'),
      canCode: canRun(e, 'toggleCode'),
      canCodeBlock: canRun(e, 'toggleCodeBlock'),
      canBulletList: canRun(e, 'toggleBulletList'),
      canOrderedList: canRun(e, 'toggleOrderedList'),
      canBlockquote: canRun(e, 'toggleBlockquote'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),

      isNodeSelected: e.state.selection instanceof NodeSelection,
    }),
  })
