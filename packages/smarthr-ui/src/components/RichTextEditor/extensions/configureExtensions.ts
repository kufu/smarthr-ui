import { Extension } from '@tiptap/core'
import { Color } from '@tiptap/extension-color'
import { FileHandler } from '@tiptap/extension-file-handler'
import Placeholder from '@tiptap/extension-placeholder'
import { TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import { TextAlign } from '@tiptap/extension-text-align'
import { BackgroundColor, FontSize, TextStyle } from '@tiptap/extension-text-style'
import { Youtube } from '@tiptap/extension-youtube'
import StarterKit from '@tiptap/starter-kit'

import { CustomImage } from './Image/CustomImage'
import {
  addImagePlaceholder,
  findImagePlaceholderPos,
  imageUploadPlaceholderPlugin,
  removeImagePlaceholder,
} from './Image/imageUploadPlaceholder'
import { LineHeight } from './LineHeight'
import { CustomTable } from './Table/CustomTable'

import type { ImageUploadResult, RichTextFeature } from '../types'
import type { AnyExtension, Editor } from '@tiptap/react'

type ConfigureExtensionsOptions = {
  features?: readonly RichTextFeature[]
  headingLevels?: ReadonlyArray<1 | 2 | 3 | 4>
  placeholder?: string
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
  onImageUploadError?: (error: unknown, file: File) => void
  onFileDrop?: (file: File, pos: number | null) => void
  acceptedMimeTypes?: string[]
}

const DEFAULT_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const DEFAULT_HEADING_LEVELS: ReadonlyArray<1 | 2 | 3 | 4> = [1, 2, 3, 4]

/**
 * 画像ファイルを即アップロードし、完了後にエディタへ挿入する共通処理。
 * - 開始時にプレースホルダ Decoration を立てる（ドキュメントには載らない）
 * - 成功: プレースホルダ位置に image ノードを挿入
 * - 失敗: onImageUploadError を呼ぶ
 * - finally: プレースホルダを除去
 */
export const uploadAndInsertImage = async (
  editor: Editor,
  file: File,
  pos: number | null,
  onImageUpload: (file: File, formData: FormData) => Promise<ImageUploadResult>,
  onImageUploadError?: (error: unknown, file: File) => void,
): Promise<void> => {
  const view = editor.view
  const insertPos = pos ?? view.state.selection.from
  const placeholderId = addImagePlaceholder(view, insertPos)

  try {
    const formData = new FormData()
    formData.append('file', file)
    const result = await onImageUpload(file, formData)

    const at = findImagePlaceholderPos(view, placeholderId) ?? insertPos
    editor
      .chain()
      .insertContentAt(at, {
        type: 'image',
        attrs: { src: result.src, alt: result.alt ?? '' },
      })
      .run()
  } catch (error) {
    onImageUploadError?.(error, file)
  } finally {
    removeImagePlaceholder(view, placeholderId)
  }
}

export const configureExtensions = ({
  features = [],
  headingLevels = DEFAULT_HEADING_LEVELS,
  placeholder,
  onImageUpload,
  onImageUploadError,
  acceptedMimeTypes,
}: ConfigureExtensionsOptions): AnyExtension[] => {
  const has = (f: RichTextFeature) => features.includes(f)

  const extensions: AnyExtension[] = [
    StarterKit.configure({
      heading: has('heading') && headingLevels.length > 0 ? { levels: [...headingLevels] } : false,
      bold: has('bold') ? {} : false,
      italic: has('italic') ? {} : false,
      strike: has('strike') ? {} : false,
      underline: has('underline') ? {} : false,
      code: has('code') ? {} : false,
      codeBlock: has('codeBlock') ? {} : false,
      blockquote: has('blockquote') ? {} : false,
      bulletList: has('bulletList') ? {} : false,
      orderedList: has('orderedList') ? {} : false,
      horizontalRule: has('horizontalRule') ? {} : false,
      link: has('link')
        ? { openOnClick: false, autolink: true, protocols: ['http', 'https', 'mailto'] }
        : false,
    }),
  ]

  if (has('textAlign')) {
    extensions.push(
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    )
  }

  if (has('image')) {
    extensions.push(
      CustomImage.configure({
        allowBase64: false,
        resize: {
          enabled: true,
          alwaysPreserveAspectRatio: true,
          minWidth: 100,
          minHeight: 100,
        },
      }),
    )

    // アップロード中プレースホルダ（ドキュメント非汚染の Decoration）
    extensions.push(
      Extension.create({
        name: 'imageUploadPlaceholder',
        addProseMirrorPlugins() {
          return [imageUploadPlaceholderPlugin()]
        },
      }),
    )

    if (onImageUpload) {
      const mimeTypes = acceptedMimeTypes ?? DEFAULT_MIME_TYPES

      extensions.push(
        FileHandler.configure({
          allowedMimeTypes: mimeTypes,
          onDrop: (editor, files, pos) => {
            const file = files.find((f) => mimeTypes.some((type) => f.type === type))
            if (file) {
              uploadAndInsertImage(editor, file, pos, onImageUpload, onImageUploadError)
            }
          },
          onPaste: (editor, files) => {
            const file = files.find((f) => mimeTypes.some((type) => f.type === type))
            if (file) {
              uploadAndInsertImage(editor, file, null, onImageUpload, onImageUploadError)
            }
          },
        }),
      )
    }
  }

  if (has('youtube')) {
    extensions.push(
      Youtube.configure({
        nocookie: true,
        allowFullscreen: true,
      }),
    )
  }

  if (has('table')) {
    // renderWrapper: true で HTML 出力にも <div class="tableWrapper"> を含める。
    // これで RichTextViewer 側でも横スクロール用 wrapper が機能する。
    extensions.push(
      CustomTable.configure({ resizable: true, renderWrapper: true }),
      TableRow,
      TableHeader,
      TableCell,
    )
  }

  if (has('color') || has('fontSize') || has('backgroundColor')) {
    extensions.push(TextStyle.configure())
  }

  if (has('color')) {
    extensions.push(Color.configure())
  }

  if (has('backgroundColor')) {
    extensions.push(BackgroundColor.configure())
  }

  if (has('fontSize')) {
    extensions.push(FontSize.configure())
  }

  if (has('lineHeight')) {
    extensions.push(LineHeight.configure({ types: ['paragraph', 'heading'] }))
  }

  if (placeholder) {
    extensions.push(
      Placeholder.configure({
        placeholder,
      }),
    )
  }

  return extensions
}

/** 全feature有効のextensions（serializer用） */
export const ALL_FEATURES: readonly RichTextFeature[] = [
  'bold',
  'italic',
  'strike',
  'underline',
  'code',
  'codeBlock',
  'bulletList',
  'orderedList',
  'blockquote',
  'horizontalRule',
  'link',
  'heading',
  'color',
  'backgroundColor',
  'fontSize',
  'lineHeight',
  'textAlign',
  'image',
  'youtube',
  'table',
] as const
