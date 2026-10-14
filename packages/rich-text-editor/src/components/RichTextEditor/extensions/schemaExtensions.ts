import { Color } from '@tiptap/extension-color'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import { TextAlign } from '@tiptap/extension-text-align'
import { BackgroundColor, FontSize, TextStyle } from '@tiptap/extension-text-style'
import { StarterKit } from '@tiptap/starter-kit'

import { AlignedYoutube } from './AlignedYoutube'
import { SafeImage } from './Image/SafeImage'
import { LineHeight } from './LineHeight'
import { CellAppearance } from './Table/CellAppearance'
import { SUPPORTED_HEADING_LEVELS } from './configureHeading'
import {
  YOUTUBE_DEFAULT_SIZE,
  YOUTUBE_EMBED_OPTIONS,
  YOUTUBE_IFRAME_ATTRIBUTES,
} from './youtubeOptions'

import type { AnyExtension, Attributes, Mark } from '@tiptap/core'
import type { ImageOptions } from '@tiptap/extension-image'
import type { TableOptions } from '@tiptap/extension-table'
import type { YoutubeOptions } from '@tiptap/extension-youtube'
import type { StarterKitOptions } from '@tiptap/starter-kit'

export const STARTER_KIT_OPTIONS = {
  // schema は常に全レベル。許可レベルの制限は操作側だけで行う
  heading: { levels: [...SUPPORTED_HEADING_LEVELS] },
  link: { openOnClick: false, autolink: true, protocols: ['http', 'https', 'mailto'] },
} satisfies Partial<StarterKitOptions>

// title を getAttribute で読むのは、既定の読み込みが "2024" や "true" を数値・真偽値に変え、
// 文字列でない値として sanitize で消えるため
export const patchLinkTitle = (extension: AnyExtension): AnyExtension => {
  if (extension.name !== 'link') return extension

  return (extension as Mark).extend({
    addAttributes() {
      const parent: Attributes = this.parent?.() ?? {}

      return {
        ...parent,
        title: {
          ...parent.title,
          parseHTML: (element: HTMLElement) => element.getAttribute('title'),
        },
      }
    },
  })
}

export const BLOCK_STYLE_TYPES = ['heading', 'paragraph']

export const IMAGE_OPTIONS = { allowBase64: false } satisfies Partial<ImageOptions>

export const YOUTUBE_OPTIONS = {
  ...YOUTUBE_EMBED_OPTIONS,
  ...YOUTUBE_DEFAULT_SIZE,
  HTMLAttributes: YOUTUBE_IFRAME_ATTRIBUTES,
} satisfies Partial<YoutubeOptions>

// renderWrapper: true で HTML 出力にも <div class="tableWrapper"> を含める。
// これで RichTextViewer 側でも横スクロール用 wrapper が機能する。
export const TABLE_OPTIONS = { renderWrapper: true } satisfies Partial<TableOptions>

/**
 * serializer が使う、schema と HTML の読み書きに要る拡張だけの一覧。
 *
 * configureExtensions は入力補助やアップロードなどエディタ専用の処理を含むため、
 * 表示専用の入口から使うと不要なモジュールまで読み込む。並び順は schema の
 * ノード順になるので configureExtensions と揃える（テストで一致を確認している）。
 */
export const createSchemaExtensions = (): AnyExtension[] => [
  StarterKit.configure(STARTER_KIT_OPTIONS).extend({
    addExtensions() {
      return (this.parent?.() ?? []).map(patchLinkTitle)
    },
  }),
  TextAlign.configure({ types: BLOCK_STYLE_TYPES }),
  SafeImage.configure(IMAGE_OPTIONS),
  AlignedYoutube.configure(YOUTUBE_OPTIONS),
  Table.configure(TABLE_OPTIONS),
  TableRow,
  CellAppearance,
  TableHeader,
  TableCell,
  // textStyleはcolor/backgroundColor/fontSizeの入れ物。これがschemaに無いと
  // textStyle markを含むJSONでドキュメント全体が消えるため常に載せる。
  TextStyle,
  Color,
  BackgroundColor,
  FontSize,
  LineHeight.configure({ types: BLOCK_STYLE_TYPES }),
]
