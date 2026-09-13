'use client'

import { useEditor } from '@tiptap/react'
import { type RefObject, useEffect, useMemo } from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { resetImagePlaceholders } from '../extensions/Image/imageUploadPlaceholder'
import { configureExtensions } from '../extensions/configureExtensions'
import { createPasteFilter } from '../extensions/pasteFilter'
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
  acceptedMimeTypes,
}: UseRichTextEditorOptions) => {
  const isControlled = value !== undefined

  const featuresKey = features.join(',')
  const headingLevelsKey = headingLevels?.join(',')

  const latest = useLatest({ placeholder, onImageUpload, onImageUploadError, acceptedMimeTypes })

  // callback や文字列の変更で extension を作り直さない。作り直しても useEditor は
  // ExtensionManager を組み直さず、依存配列へ入れれば Editor ごと作り直して
  // 本文と Undo 履歴を失う。extension 側には getter を渡して実行時に読ませる。
  const getRuntimeOptions = useMemo(
    () => () => ({
      placeholder: latest.placeholder,
      onImageUpload: latest.onImageUpload,
      onImageUploadError: latest.onImageUploadError,
      acceptedMimeTypes: latest.acceptedMimeTypes,
    }),
    [latest],
  )

  const extensions = useMemo(
    () =>
      configureExtensions({
        features,
        allowedHeadingLevels: headingLevels,
        getRuntimeOptions,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [featuresKey, headingLevelsKey, getRuntimeOptions],
  )

  // schemaは全書式を載せているのでペーストはschemaで止まらない。
  // featuresの許可リストで絞るのはこのフィルタの責務。
  const transformPasted = useMemo(
    () => createPasteFilter(features, headingLevels),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [featuresKey, headingLevelsKey],
  )

  const editor = useEditor({
    extensions,
    content: isControlled ? value : defaultValue,
    editable: !(readOnly || disabled),
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      transformPasted,
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
      // 空判定とテキストは editor と同じ結果にする必要があるため、この時点の値を読んで渡す
      const json = e.getJSON() as RichTextJSON
      const characterCount = e.getText({ blockSeparator: '' }).length
      onChange?.(
        json,
        createChangeMeta(json, characterCount, { isEmpty: e.isEmpty, text: e.getText() }),
      )
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
      // 未完了の画像アップロードは差し替えと同じ transaction で無効化する
      editor
        .chain()
        .setContent(value, { emitUpdate: false })
        .command(({ tr }) => {
          resetImagePlaceholders(tr)

          return true
        })
        .run()
    }
  }, [editor, isControlled, value])

  // editable 状態の同期
  useEffect(() => {
    if (!editor) return
    const editable = !(readOnly || disabled)
    if (editor.isEditable !== editable) {
      // 本文は変わっていないので変更通知を出さない
      editor.setEditable(editable, false)
    }
  }, [editor, readOnly, disabled])

  // placeholder の同期
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      // Placeholder は decoration なので、state が動かないと新しい文字列で作り直されない。
      // 文書を変えない空の transaction で再計算させる。docChanged が無いため
      // onUpdate は発火せず、履歴にも積まれない。
      editor.view.dispatch(editor.state.tr)
    }
  }, [editor, placeholder])

  return { editor }
}
