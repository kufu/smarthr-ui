'use client'

import { useEditor } from '@tiptap/react'
import { type RefObject, useEffect, useMemo } from 'react'

import { configureExtensions } from '../extensions/configureExtensions'
import { createChangeMeta } from '../serializers/createChangeMeta'

import type { RichTextEditorProps, RichTextJSON } from '../types'

type UseRichTextEditorOptions = Pick<
  RichTextEditorProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onFocus'
  | 'onBlur'
  | 'features'
  | 'disabled'
  | 'readOnly'
  | 'placeholder'
> & {
  toolbarRef?: RefObject<HTMLDivElement | null>
}

export const useRichTextEditor = ({
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  features = ['bold', 'italic', 'bulletList', 'orderedList', 'link'],
  disabled,
  readOnly,
  placeholder,
  toolbarRef,
}: UseRichTextEditorOptions) => {
  const isControlled = value !== undefined

  const extensions = useMemo(
    () => configureExtensions({ features, placeholder }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [features.join(','), placeholder],
  )

  const editor = useEditor({
    extensions,
    content: isControlled ? value : defaultValue,
    editable: !(readOnly || disabled),
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      handleKeyDown: (_view, event) => {
        // Alt+F10 でtoolbarへフォーカス移動
        if (event.altKey && event.key === 'F10' && toolbarRef?.current) {
          event.preventDefault()
          const firstButton = toolbarRef.current.querySelector<HTMLButtonElement>(
            'button[tabindex="0"]:not(:disabled)',
          )
          firstButton?.focus()
          return true
        }
        return false
      },
    },
    onUpdate: ({ editor: e }) => {
      const json = e.getJSON() as RichTextJSON
      onChange?.(json, createChangeMeta(json))
    },
    onFocus: () => onFocus?.(),
    onBlur: () => onBlur?.(),
  })

  // controlled mode: 外からのvalue変更を同期
  useEffect(() => {
    if (!editor || !isControlled || !value) return

    const currentJSON = JSON.stringify(editor.getJSON())
    const nextJSON = JSON.stringify(value)

    if (currentJSON !== nextJSON) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [editor, isControlled, value])

  // editable 状態の同期
  useEffect(() => {
    if (!editor) return
    const editable = !(readOnly || disabled)
    if (editor.isEditable !== editable) {
      editor.setEditable(editable)
    }
  }, [editor, readOnly, disabled])

  return editor
}
