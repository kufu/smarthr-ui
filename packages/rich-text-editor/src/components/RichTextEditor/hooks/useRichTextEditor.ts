'use client'

import { useEditor } from '@tiptap/react'
import { type RefObject, useEffect, useMemo, useRef, useState } from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { resetImagePlaceholders } from '../extensions/Image/imageUploadPlaceholder'
import { configureExtensions } from '../extensions/configureExtensions'
import { createPasteFilter } from '../extensions/pasteFilter'
import {
  reconfigureEditorOperations,
  rememberManagedPlugins,
} from '../extensions/reconfigureEditorOperations'
import { createChangeMeta } from '../serializers/createChangeMeta'
import { getDetachedJSON } from '../serializers/getDetachedJSON'
import { toEditorContent } from '../serializers/toEditorContent'

import type { ImageUploadResult, RichTextFeature, RichTextJSON } from '../types'
import type { JSONContent } from '@tiptap/core'
import type { Node as ProseMirrorNode, Schema } from '@tiptap/pm/model'

/**
 * 末尾の段落まで比べないのは、末尾が段落でない value にはエディタが空の段落を足すため
 * （StarterKit の TrailingNode）。足されたぶんまで比べると、同じ内容でも毎回別物になる
 */
const isSameDocument = (doc: ProseMirrorNode, content: JSONContent, schema: Schema) => {
  let next: ProseMirrorNode

  try {
    next = schema.nodeFromJSON(content)
  } catch {
    return false
  }

  if (doc.eq(next)) return true

  const last = doc.lastChild

  return (
    !!last &&
    last.type.name === 'paragraph' &&
    last.childCount === 0 &&
    last.sameMarkup(last.type.create()) &&
    next.lastChild?.type.name !== 'paragraph' &&
    doc.copy(doc.content.cut(0, doc.content.size - last.nodeSize)).eq(next)
  )
}

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

  const latest = useLatest({
    features,
    headingLevels,
    placeholder,
    onImageUpload,
    onImageUploadError,
    acceptedMimeTypes,
  })

  // props の変更で extension を作り直さない。作り直しても useEditor は ExtensionManager を
  // 組み直さず、依存配列へ入れれば Editor ごと作り直して本文と Undo 履歴を失う。
  // extension 側には getter を渡して実行時に読ませる。
  const getRuntimeOptions = useMemo(
    () => () => ({
      features: latest.features,
      allowedHeadingLevels: latest.headingLevels,
      placeholder: latest.placeholder,
      onImageUpload: latest.onImageUpload,
      onImageUploadError: latest.onImageUploadError,
      acceptedMimeTypes: latest.acceptedMimeTypes,
    }),
    [latest],
  )

  const extensions = useMemo(() => configureExtensions({ getRuntimeOptions }), [getRuntimeOptions])

  // schemaは全書式を載せているのでペーストはschemaで止まらない。
  // featuresの許可リストで絞るのはこのフィルタの責務。
  const transformPasted = useMemo(
    () => createPasteFilter(features, headingLevels),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [featuresKey, headingLevelsKey],
  )

  // useEditor が content を読むのは生成時だけなので、schema の検査も初回だけにする
  const [initialContent] = useState(() => {
    const initial = isControlled ? value : defaultValue

    return initial === undefined ? undefined : toEditorContent(initial)
  })

  const editor = useEditor({
    extensions,
    content: initialContent,
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
      if (!onChange) return

      // 空判定とテキストは editor と同じ結果にする必要があるため、この時点の値を読んで渡す
      const json = getDetachedJSON(e)
      const characterCount = e.getText({ blockSeparator: '' }).length
      onChange(
        json,
        createChangeMeta(json, characterCount, { isEmpty: e.isEmpty, text: e.getText() }),
      )
    },
    onFocus: () => onFocus?.(),
    onBlur: () => onBlur?.(),
  })

  // controlled mode: 外からのvalue変更を同期
  useEffect(() => {
    // JSON の文字列では、既定値の属性（textAlign: null など）を省いた value が別物と判定され、
    // 本文の作り直しでキャレットと編集履歴が失われる。参照の一致で省くと、onChange で渡した
    // オブジェクトを親が書き換えて戻したときに反映されない。
    // 正規化した値だけで比べないのは、貼り付けたリンクの class のように正規化で変わる属性を
    // 本文が持っていると、onChange の値をそのまま戻しても別物になるため
    if (
      !editor ||
      !isControlled ||
      !value ||
      isSameDocument(editor.state.doc, value, editor.schema)
    ) {
      return
    }

    const nextContent = toEditorContent(value)

    if (!isSameDocument(editor.state.doc, nextContent, editor.schema)) {
      // 未完了の画像アップロードは差し替えと同じ transaction で無効化する
      editor
        .chain()
        .setContent(nextContent, { emitUpdate: false })
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

  // features / 見出しの許可レベルの同期
  const reconfigured = useRef(false)
  useEffect(() => {
    if (!editor || editor.isDestroyed) return

    if (!reconfigured.current) {
      // 生成直後の一覧を管理対象として覚えるだけにする。組み直す必要はない
      reconfigured.current = true
      rememberManagedPlugins(editor)

      return
    }

    if (!editor.view.composing) {
      reconfigureEditorOperations(editor)

      return
    }

    // 変換中に plugin を組み直すと入力中の文字が壊れる。確定まで待つ
    const handleCompositionEnd = () => reconfigureEditorOperations(editor)

    editor.view.dom.addEventListener('compositionend', handleCompositionEnd, { once: true })

    return () => {
      editor.view.dom.removeEventListener('compositionend', handleCompositionEnd)
    }
  }, [editor, featuresKey, headingLevelsKey])

  // placeholder の同期
  useEffect(() => {
    // useEditor も再描画ごとに setOptions で描き直すが、それは editorProps が毎回新しいためで、
    // メモ化すると止まる。空の transaction で描き直さないのは、appendTransaction を持つ plugin
    // （TrailingNode など）が文書を変え、操作していないのに onChange と履歴が発生するため
    if (editor && !editor.isDestroyed) {
      editor.view.setProps({})
    }
  }, [editor, placeholder])

  return { editor }
}
