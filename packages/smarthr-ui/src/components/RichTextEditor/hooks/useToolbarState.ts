'use client'

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
      isHeading1: e.isActive('heading', { level: 1 }),
      isHeading2: e.isActive('heading', { level: 2 }),
      isHeading3: e.isActive('heading', { level: 3 }),
      isHeading4: e.isActive('heading', { level: 4 }),
      currentHeadingLevel: (e.isActive('heading', { level: 1 })
        ? 1
        : e.isActive('heading', { level: 2 })
          ? 2
          : e.isActive('heading', { level: 3 })
            ? 3
            : e.isActive('heading', { level: 4 })
              ? 4
              : null) as 1 | 2 | 3 | 4 | null,
      isLink: e.isActive('link'),
      currentColor: (e.getAttributes('textStyle').color as string) ?? null,
      currentFontSize: (e.getAttributes('textStyle').fontSize as string) ?? null,
      isInHeading: e.isActive('heading'),

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
    }),
  })
