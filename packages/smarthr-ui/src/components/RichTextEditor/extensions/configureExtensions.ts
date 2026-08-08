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
import { DEFAULT_MIME_TYPES, matchesMimeType } from './Image/mimeTypes'
import { LineHeight } from './LineHeight'
import { CustomTable } from './Table/CustomTable'
import { patchListItemShiftTab } from './listItemShiftTab'
import { createOperationRestrictor, getRestrictedExtensionNames } from './restrictOperations'

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

  // schemaは常に全書式を載せる。featuresに無い書式が入力に含まれていても失わないため。
  // Tiptapは未知のmark/nodeを含むJSONを受け取るとドキュメント全体を空にするので、
  // featuresでschemaを削ると既存データが消える。
  // featuresは「新しく適用できる操作」の制限として、操作だけを剥がして表現する。
  const restrictedNames = getRestrictedExtensionNames(features)

  // headingLevelsが空指定のときは見出しを適用させない。
  // schemaにはデフォルトのレベルを載せて既存の見出しを読めるようにする。
  const headingEnabled = has('heading') && headingLevels.length > 0
  if (!headingEnabled) {
    restrictedNames.add('heading')
  }

  const restrict = createOperationRestrictor(restrictedNames)

  const extensions: AnyExtension[] = [
    StarterKit.configure({
      heading: { levels: [...(headingEnabled ? headingLevels : DEFAULT_HEADING_LEVELS)] },
      link: { openOnClick: false, autolink: true, protocols: ['http', 'https', 'mailto'] },
    }).extend({
      addExtensions() {
        // patch を restrict より先に通す。features にリストが無いとき restrict が
        // addKeyboardShortcuts を空にするので、差し替えた Shift-Tab もそこで消える。
        return (this.parent?.() ?? []).map(patchListItemShiftTab).map(restrict)
      },
    }),
    restrict(
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ),
    restrict(
      CustomImage.configure({
        allowBase64: false,
        // featuresにimageが無いときはドラッグリサイズもさせない（NodeView側の機能なので
        // STRIPPED_OPERATIONSでは外れない）
        resize: has('image')
          ? {
              enabled: true,
              alwaysPreserveAspectRatio: true,
              minWidth: 100,
              minHeight: 100,
            }
          : { enabled: false },
      }),
    ),
  ]

  if (has('image')) {
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
        // allowedMimeTypes は渡さない。FileHandler の判定が完全一致で `image/*` を通せず、
        // ファイル選択ダイアログの accept 属性と挙動がずれるため、フィルタは自前で行う。
        FileHandler.configure({
          onDrop: (editor, files, pos) => {
            const file = files.find((f) => matchesMimeType(f.type, mimeTypes))
            if (file) {
              uploadAndInsertImage(editor, file, pos, onImageUpload, onImageUploadError)
            }
          },
          onPaste: (editor, files) => {
            const file = files.find((f) => matchesMimeType(f.type, mimeTypes))
            if (file) {
              uploadAndInsertImage(editor, file, null, onImageUpload, onImageUploadError)
            }
          },
        }),
      )
    }
  }

  extensions.push(
    restrict(
      Youtube.configure({
        nocookie: true,
        allowFullscreen: true,
      }),
    ),
    // renderWrapper: true で HTML 出力にも <div class="tableWrapper"> を含める。
    // これで RichTextViewer 側でも横スクロール用 wrapper が機能する。
    restrict(CustomTable.configure({ resizable: true, renderWrapper: true })),
    TableRow,
    TableHeader,
    TableCell,
    // textStyleはcolor/backgroundColor/fontSizeの入れ物。これがschemaに無いと
    // textStyle markを含むJSONでドキュメント全体が消えるため常に載せる。
    TextStyle.configure(),
    restrict(Color.configure()),
    restrict(BackgroundColor.configure()),
    restrict(FontSize.configure()),
    restrict(LineHeight.configure({ types: ['paragraph', 'heading'] })),
  )

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
