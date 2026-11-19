import {
  FaAlignLeftIcon,
  FaCirclePlayIcon,
  FaFileCodeIcon,
  FaFontIcon,
  FaImageIcon,
  FaListOlIcon,
  FaListUlIcon,
  FaMinusIcon,
  FaQuoteLeftIcon,
  FaTableIcon,
} from 'smarthr-ui'

import { toSearchText } from '../../../libs/searchText'

import { VideoIcon } from './Video/VideoIcon'

import type { HeadingLevel } from './configureHeading'
import type { InsertDialogKind } from './insertDialogs'
import type { UseIntlReturn, typedJa } from '../../../intl'
import type { RichTextFeature } from '../types'
import type { ChainedCommands } from '@tiptap/core'
import type { Node as PMNode } from '@tiptap/pm/model'
import type { JSXElementConstructor } from 'react'

type MessageId = keyof typeof typedJa

export type LabelDescriptor = {
  [K in MessageId]: { id: K; defaultText: (typeof typedJa)[K] }
}[MessageId]

export type BlockCatalogId =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'codeBlock'
  | 'horizontalRule'
  | 'table'
  | 'image'
  | 'youtube'
  | 'video'

export const LIST_NODE_NAMES = ['bulletList', 'orderedList'] as const

export type ConversionShape =
  | { type: 'textblock'; nodeName: 'paragraph' }
  | { type: 'textblock'; nodeName: 'heading'; level: HeadingLevel }
  | { type: 'list'; nodeName: (typeof LIST_NODE_NAMES)[number] }
  | { type: 'blockquote' }
  | { type: 'codeBlock' }

export type BlockCatalogEntry = {
  id: BlockCatalogId
  matches: (node: PMNode) => boolean
  feature: RichTextFeature | null
  headingLevel?: HeadingLevel
  group: 'text' | 'media'
  label: LabelDescriptor
  /** 移動・複製・削除の読み上げで使う名前。label は「表を挿入」のような操作の名前を含むため分ける */
  name: LabelDescriptor
  keywords: readonly string[]
  icon: JSXElementConstructor<Record<string, never>>
  creation:
    | { type: 'command'; apply: (chain: ChainedCommands) => ChainedCommands }
    | { type: 'dialog'; dialog: InsertDialogKind }
    | null
  /** 省略できないのは、種類を足すときに変換先にするかを必ず決めるため */
  conversion: ConversionShape | null
}

const isType = (name: string) => (node: PMNode) => node.type.name === name

const HEADING_LABELS = {
  1: { id: 'smarthr-ui/RichTextEditor/heading1', defaultText: '見出し1' },
  2: { id: 'smarthr-ui/RichTextEditor/heading2', defaultText: '見出し2' },
  3: { id: 'smarthr-ui/RichTextEditor/heading3', defaultText: '見出し3' },
  4: { id: 'smarthr-ui/RichTextEditor/heading4', defaultText: '見出し4' },
} as const satisfies Record<HeadingLevel, LabelDescriptor>

const heading = (level: HeadingLevel): BlockCatalogEntry => ({
  id: `heading${level}`,
  matches: (node) => node.type.name === 'heading' && node.attrs.level === level,
  feature: 'heading',
  headingLevel: level,
  group: 'text',
  label: HEADING_LABELS[level],
  name: HEADING_LABELS[level],
  keywords: [`h${level}`, 'heading', 'みだし'],
  icon: FaFontIcon,
  creation: { type: 'command', apply: (chain) => chain.setHeading({ level }) },
  conversion: { type: 'textblock', nodeName: 'heading', level },
})

export const BLOCK_CATALOG: readonly BlockCatalogEntry[] = [
  {
    id: 'paragraph',
    matches: isType('paragraph'),
    feature: null,
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/headingNormal', defaultText: '標準テキスト' },
    name: { id: 'smarthr-ui/RichTextEditor/blockNameParagraph', defaultText: '段落' },
    keywords: ['p', 'paragraph', 'text', 'ほんぶん', 'だんらく'],
    icon: FaAlignLeftIcon,
    creation: null,
    conversion: { type: 'textblock', nodeName: 'paragraph' },
  },
  heading(1),
  heading(2),
  heading(3),
  heading(4),
  {
    id: 'bulletList',
    matches: isType('bulletList'),
    feature: 'bulletList',
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/bulletList', defaultText: '箇条書きリスト' },
    name: { id: 'smarthr-ui/RichTextEditor/bulletList', defaultText: '箇条書きリスト' },
    keywords: ['ul', 'list', 'bullet', 'りすと', 'かじょうがき'],
    icon: FaListUlIcon,
    creation: { type: 'command', apply: (chain) => chain.toggleBulletList() },
    conversion: { type: 'list', nodeName: 'bulletList' },
  },
  {
    id: 'orderedList',
    matches: isType('orderedList'),
    feature: 'orderedList',
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/orderedList', defaultText: '番号付きリスト' },
    name: { id: 'smarthr-ui/RichTextEditor/orderedList', defaultText: '番号付きリスト' },
    keywords: ['ol', 'list', 'number', 'りすと', 'ばんごう'],
    icon: FaListOlIcon,
    creation: { type: 'command', apply: (chain) => chain.toggleOrderedList() },
    conversion: { type: 'list', nodeName: 'orderedList' },
  },
  {
    id: 'blockquote',
    matches: isType('blockquote'),
    feature: 'blockquote',
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/blockquote', defaultText: '引用' },
    name: { id: 'smarthr-ui/RichTextEditor/blockquote', defaultText: '引用' },
    keywords: ['quote', 'blockquote', 'いんよう'],
    icon: FaQuoteLeftIcon,
    creation: { type: 'command', apply: (chain) => chain.setBlockquote() },
    conversion: { type: 'blockquote' },
  },
  {
    id: 'codeBlock',
    matches: isType('codeBlock'),
    feature: 'codeBlock',
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/codeBlock', defaultText: 'コードブロック' },
    name: { id: 'smarthr-ui/RichTextEditor/codeBlock', defaultText: 'コードブロック' },
    keywords: ['code', 'pre', 'こーど'],
    icon: FaFileCodeIcon,
    creation: { type: 'command', apply: (chain) => chain.setCodeBlock() },
    conversion: { type: 'codeBlock' },
  },
  {
    id: 'horizontalRule',
    matches: isType('horizontalRule'),
    feature: 'horizontalRule',
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/horizontalRule', defaultText: '水平線' },
    name: { id: 'smarthr-ui/RichTextEditor/horizontalRule', defaultText: '水平線' },
    keywords: ['hr', 'divider', 'line', 'すいへいせん', 'くぎりせん'],
    icon: FaMinusIcon,
    creation: { type: 'command', apply: (chain) => chain.setHorizontalRule() },
    conversion: null,
  },
  {
    id: 'table',
    matches: isType('table'),
    feature: 'table',
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/tableInsert', defaultText: '表を挿入' },
    name: { id: 'smarthr-ui/RichTextEditor/blockNameTable', defaultText: '表' },
    keywords: ['table', 'ひょう', 'てーぶる'],
    icon: FaTableIcon,
    // 大きさを尋ねるダイアログを開かないのは、行と列は入れたあとに表のメニューで増減できるため
    creation: {
      type: 'command',
      apply: (chain) => chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    },
    conversion: null,
  },
  {
    id: 'image',
    matches: isType('image'),
    feature: 'image',
    group: 'media',
    label: { id: 'smarthr-ui/RichTextEditor/image', defaultText: '画像を挿入' },
    name: { id: 'smarthr-ui/RichTextEditor/blockNameImage', defaultText: '画像' },
    keywords: ['image', 'img', 'picture', 'がぞう', 'しゃしん'],
    icon: FaImageIcon,
    creation: { type: 'dialog', dialog: 'image' },
    conversion: null,
  },
  {
    id: 'youtube',
    matches: isType('youtube'),
    feature: 'youtube',
    group: 'media',
    label: { id: 'smarthr-ui/RichTextEditor/youtube', defaultText: 'YouTube動画を埋め込む' },
    name: { id: 'smarthr-ui/RichTextEditor/blockNameYoutube', defaultText: 'YouTube動画' },
    keywords: ['youtube', 'ゆーちゅーぶ', 'どうが'],
    icon: FaCirclePlayIcon,
    creation: { type: 'dialog', dialog: 'youtube' },
    conversion: null,
  },
  {
    id: 'video',
    matches: isType('video'),
    feature: 'video',
    group: 'media',
    label: { id: 'smarthr-ui/RichTextEditor/video', defaultText: '動画を挿入' },
    name: { id: 'smarthr-ui/RichTextEditor/blockNameVideo', defaultText: '動画' },
    keywords: ['video', 'movie', 'どうが'],
    icon: VideoIcon,
    creation: { type: 'dialog', dialog: 'video' },
    conversion: null,
  },
]

const EXCERPT_LENGTH = 20

// ブロック全体を読まないのは、大きな表やリストの中で打つたびに、⋮⋮ の名前のために全体を文字列にすることになるため
const EXCERPT_SCAN_SIZE = 1000

/** 文にしないのは、localize がフックからしか取れないため */
export const describeBlock = (node: PMNode) => {
  // 表やリストのセル・項目の間に区切りを入れないと、隣り合う文字が 1 語につながって読まれる
  const text = (
    node.isLeaf
      ? String(node.attrs.alt ?? node.attrs.title ?? '')
      : node.textBetween(0, Math.min(node.content.size, EXCERPT_SCAN_SIZE), ' ')
  )
    .replace(/\s+/g, ' ')
    .trim()
  const chars = Array.from(text)

  return {
    blockId: BLOCK_CATALOG.find((entry) => entry.matches(node))?.id ?? null,
    excerpt: chars.length > EXCERPT_LENGTH ? `${chars.slice(0, EXCERPT_LENGTH).join('')}…` : text,
  }
}

export const describeSubject = (
  { blockId, excerpt, count }: { blockId: BlockCatalogId | null; excerpt: string; count: number },
  localize: UseIntlReturn['localize'],
) => {
  const entry = count === 1 ? BLOCK_CATALOG.find(({ id }) => id === blockId) : undefined

  if (!entry) {
    return localize(
      { id: 'smarthr-ui/RichTextEditor/blockCount', defaultText: '{count}個のブロック' },
      { count },
    )
  }

  const name = localize(entry.name)

  return excerpt
    ? localize(
        { id: 'smarthr-ui/RichTextEditor/blockWithExcerpt', defaultText: '{name}「{excerpt}」' },
        { name, excerpt },
      )
    : name
}

export const isBlockAllowed = (
  entry: BlockCatalogEntry,
  features: readonly RichTextFeature[],
  headingLevels: readonly HeadingLevel[],
) =>
  (entry.feature === null || features.includes(entry.feature)) &&
  (entry.headingLevel === undefined || headingLevels.includes(entry.headingLevel))

export const matchesBlockQuery = (
  { label, keywords }: { label: string; keywords: readonly string[] },
  query: string,
) => {
  const searchText = toSearchText(query).trim()

  return [label, ...keywords].some((text) => toSearchText(text).includes(searchText))
}
