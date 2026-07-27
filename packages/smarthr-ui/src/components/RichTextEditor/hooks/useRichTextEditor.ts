'use client'

import { useEditor } from '@tiptap/react'
import { type RefObject, useEffect, useMemo } from 'react'

import { collectImageSrcs, diffRemovedSrcs } from '../extensions/Image/collectImageSrcs'
import { configureExtensions } from '../extensions/configureExtensions'
import { createChangeMeta } from '../serializers/createChangeMeta'

import type { ImageUploadResult, RichTextFeature, RichTextJSON } from '../types'

type UseRichTextEditorOptions = {
  value?: RichTextJSON
  defaultValue?: RichTextJSON
  onChange?: (value: RichTextJSON, meta: ReturnType<typeof createChangeMeta>) => void
  onFocus?: () => void
  onBlur?: () => void
  features?: readonly RichTextFeature[]
  headingLevels?: ReadonlyArray<1 | 2 | 3 | 4>
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  toolbarRef?: RefObject<HTMLDivElement | null>
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
  onImageUploadError?: (error: unknown, file: File) => void
  onImageRemove?: (src: string) => void
  acceptedMimeTypes?: string[]
}

export const useRichTextEditor = ({
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  features = ['bold', 'italic', 'bulletList', 'orderedList', 'link'],
  headingLevels,
  disabled,
  readOnly,
  placeholder,
  toolbarRef,
  onImageUpload,
  onImageUploadError,
  onImageRemove,
  acceptedMimeTypes,
}: UseRichTextEditorOptions) => {
  const isControlled = value !== undefined

  const featuresKey = features.join(',')
  const headingLevelsKey = headingLevels?.join(',')
  const mimeTypesKey = acceptedMimeTypes?.join(',')

  const extensions = useMemo(
    () =>
      configureExtensions({
        features,
        headingLevels,
        placeholder,
        onImageUpload,
        onImageUploadError,
        acceptedMimeTypes,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [featuresKey, headingLevelsKey, placeholder, onImageUpload, onImageUploadError, mimeTypesKey],
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
    onUpdate: ({ editor: e, transaction }) => {
      const json = e.getJSON() as RichTextJSON
      const characterCount = e.getText({ blockSeparator: '' }).length
      onChange?.(json, createChangeMeta(json, characterCount))

      if (onImageRemove && transaction.docChanged) {
        const before = collectImageSrcs(transaction.before)
        const after = collectImageSrcs(transaction.doc)
        const removed = diffRemovedSrcs(before, after)
        for (const src of removed) {
          onImageRemove(src)
        }
      }
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

  return { editor }
}
