import { Extension } from '@tiptap/core'
import { Color } from '@tiptap/extension-color'
import { FileHandler } from '@tiptap/extension-file-handler'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import { TextAlign } from '@tiptap/extension-text-align'
import { BackgroundColor, FontSize, TextStyle } from '@tiptap/extension-text-style'
import { Youtube } from '@tiptap/extension-youtube'
import { StarterKit } from '@tiptap/starter-kit'

import { CustomImage } from './Image/CustomImage'
import { createImagePasteExtension } from './Image/imagePaste'
import { imageUploadPlaceholderPlugin } from './Image/imageUploadPlaceholder'
import { DEFAULT_MIME_TYPES, matchesMimeType } from './Image/mimeTypes'
import { uploadAndInsertImage } from './Image/uploadAndInsertImage'
import { LineHeight } from './LineHeight'
import { LinkShortcut } from './LinkShortcut'
import { CellAppearance } from './Table/CellAppearance'
import { CustomTable } from './Table/CustomTable'
import {
  type HeadingLevel,
  SUPPORTED_HEADING_LEVELS,
  createHeadingOperationLimiter,
} from './configureHeading'
import { patchListItemShiftTab } from './listItemShiftTab'
import { createOperationRestrictor } from './restrictOperations'
import { NO_RUNTIME_OPTIONS } from './runtimeOptions'
import { YOUTUBE_EMBED_OPTIONS } from './youtubeOptions'

import type { GetRichTextRuntimeOptions } from './runtimeOptions'
import type { RichTextFeature } from '../types'
import type { AnyExtension } from '@tiptap/react'

type ConfigureExtensionsOptions = {
  /** 変化しない前提の設定。動的に変える場合は getRuntimeOptions を使う */
  features?: readonly RichTextFeature[]
  /** 新しく適用できる見出しレベル。schema に載せるレベルとは別 */
  allowedHeadingLevels?: readonly HeadingLevel[]
  /**
   * マウント後に変わりうる設定の getter。
   * Editor を作り直さずに最新値を反映するため、値ではなく getter で受ける。
   */
  getRuntimeOptions?: GetRichTextRuntimeOptions
}

export const configureExtensions = ({
  features,
  allowedHeadingLevels,
  getRuntimeOptions,
}: ConfigureExtensionsOptions = {}): AnyExtension[] => {
  const getOptions: GetRichTextRuntimeOptions =
    getRuntimeOptions ??
    (features === undefined && allowedHeadingLevels === undefined
      ? NO_RUNTIME_OPTIONS
      : () => ({ features, allowedHeadingLevels }))
  const getFeatures = () => getOptions().features ?? []
  const getAllowedHeadingLevels = () =>
    getOptions().allowedHeadingLevels ?? SUPPORTED_HEADING_LEVELS

  // schemaは常に全書式を載せる。featuresに無い書式が入力に含まれていても失わないため。
  // Tiptapは未知のmark/nodeを含むJSONを受け取るとドキュメント全体を空にするので、
  // featuresでschemaを削ると既存データが消える。
  // featuresは「新しく適用できる操作」の制限として、操作だけを剥がして表現する。
  const restrict = createOperationRestrictor(getFeatures)
  const limitHeading = createHeadingOperationLimiter(getAllowedHeadingLevels)

  const extensions: AnyExtension[] = [
    StarterKit.configure({
      // schema は常に全レベル。許可レベルの制限は操作側だけで行う
      heading: { levels: [...SUPPORTED_HEADING_LEVELS] },
      link: { openOnClick: false, autolink: true, protocols: ['http', 'https', 'mailto'] },
    }).extend({
      addExtensions() {
        // patch を restrict より先に通す。features にリストが無いとき restrict が
        // addKeyboardShortcuts を空にするので、差し替えた Shift-Tab もそこで消える。
        return (this.parent?.() ?? []).map(patchListItemShiftTab).map(limitHeading).map(restrict)
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
        // ドラッグリサイズは NodeView 側の機能なので、操作を剥がすだけでは止まらない
        isResizable: () => getFeatures().includes('image'),
        resize: {
          enabled: true,
          alwaysPreserveAspectRatio: true,
          minWidth: 100,
          minHeight: 100,
        },
      }),
    ),
    // features に無い間も登録しておく。後から足せないため、操作の可否は実行時に判定する。
    restrict(LinkShortcut),
    // アップロード中プレースホルダ（ドキュメント非汚染の Decoration）
    Extension.create({
      name: 'imageUploadPlaceholder',
      addProseMirrorPlugins() {
        return [imageUploadPlaceholderPlugin()]
      },
    }),
    // allowedMimeTypes は渡さない。FileHandler の判定が完全一致で `image/*` を通せず、
    // ファイル選択ダイアログの accept 属性と挙動がずれるため、フィルタは自前で行う。
    // onPaste は使わない（HTMLを含むクリップボードで二重挿入になる）。
    FileHandler.configure({
      onDrop: (editor, files, pos) => {
        // 1回のドロップで使う関数はここで確定させる
        const { onImageUpload, onImageUploadError, acceptedMimeTypes } = getOptions()

        if (!onImageUpload || !getFeatures().includes('image')) return

        const mimeTypes = acceptedMimeTypes ?? DEFAULT_MIME_TYPES
        const file = files.find((f) => matchesMimeType(f.type, mimeTypes))

        if (file) {
          uploadAndInsertImage(editor, file, pos, onImageUpload, onImageUploadError)
        }
      },
    }),
    createImagePasteExtension({ getRuntimeOptions: getOptions }),
  ]

  extensions.push(
    restrict(Youtube.configure(YOUTUBE_EMBED_OPTIONS)),
    // renderWrapper: true で HTML 出力にも <div class="tableWrapper"> を含める。
    // これで RichTextViewer 側でも横スクロール用 wrapper が機能する。
    restrict(CustomTable.configure({ resizable: true, renderWrapper: true })),
    TableRow,
    CellAppearance,
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

  extensions.push(
    // 文字列が空でも登録しておく。未指定から指定へ変わったときに extension を足し直せない。
    Placeholder.configure({
      placeholder: () => getOptions().placeholder ?? '',
    }),
  )

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
