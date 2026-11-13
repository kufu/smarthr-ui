'use client'

import { useEffect } from 'react'

import type { InsertDialogKind, InsertDialogOpener } from '../extensions/insertDialogs'
import type { Editor } from '@tiptap/core'

// ボタンが disabled の間も登録を外さない。ノード選択を抜けるのと / で開くのが同じトランザクションだと、
// 登録し直す effect より先にメニューが項目を作り、メディアの項目が欠ける
export const useInsertDialogOpener = (
  editor: Editor,
  kind: InsertDialogKind,
  opener: InsertDialogOpener,
) => {
  useEffect(() => {
    const storage = editor.storage.insertDialogs

    if (!storage) return undefined

    storage.openers[kind] = opener

    return () => {
      if (storage.openers[kind] === opener) delete storage.openers[kind]
    }
  }, [editor, kind, opener])
}
