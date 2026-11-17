'use client'

import { useEffect } from 'react'

import { useLatest } from '../../../hooks/useLatest'

import type { InsertDialogKind, InsertDialogOpener } from '../extensions/insertDialogs'
import type { Editor } from '@tiptap/core'

// ボタンが disabled の間も登録を外さない。ノード選択を抜けるのと / で開くのが同じトランザクションだと、
// 登録し直す effect より先にメニューが項目を作り、メディアの項目が欠ける
export const useInsertDialogOpener = (
  editor: Editor,
  kind: InsertDialogKind,
  opener: InsertDialogOpener,
) => {
  const latest = useLatest({ editor, kind, opener })

  useEffect(() => {
    const { editor: currentEditor, kind: currentKind } = latest
    const storage = currentEditor.storage.insertDialogs

    if (!storage) return undefined

    const open: InsertDialogOpener = (anchor) => latest.opener(anchor)

    storage.openers[currentKind] = open

    return () => {
      if (storage.openers[currentKind] === open) delete storage.openers[currentKind]
    }
  }, [latest])
}
