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
import type { typedJa } from '../../../intl'
import type { RichTextFeature } from '../types'
import type { ChainedCommands } from '@tiptap/core'
import type { Node as PMNode } from '@tiptap/pm/model'
import type { JSXElementConstructor } from 'react'

type MessageId = keyof typeof typedJa

type LabelDescriptor = {
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

export type BlockCatalogEntry = {
  id: BlockCatalogId
  matches: (node: PMNode) => boolean
  feature: RichTextFeature | null
  headingLevel?: HeadingLevel
  group: 'text' | 'media'
  label: LabelDescriptor
  keywords: readonly string[]
  icon: JSXElementConstructor<Record<string, never>>
  creation:
    | { type: 'command'; apply: (chain: ChainedCommands) => ChainedCommands }
    | { type: 'dialog'; dialog: InsertDialogKind }
    | null
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
  keywords: [`h${level}`, 'heading', 'みだし'],
  icon: FaFontIcon,
  creation: { type: 'command', apply: (chain) => chain.setHeading({ level }) },
})

export const BLOCK_CATALOG: readonly BlockCatalogEntry[] = [
  {
    id: 'paragraph',
    matches: isType('paragraph'),
    feature: null,
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/headingNormal', defaultText: '標準テキスト' },
    keywords: ['p', 'paragraph', 'text', 'ほんぶん', 'だんらく'],
    icon: FaAlignLeftIcon,
    creation: null,
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
    keywords: ['ul', 'list', 'bullet', 'りすと', 'かじょうがき'],
    icon: FaListUlIcon,
    creation: { type: 'command', apply: (chain) => chain.toggleBulletList() },
  },
  {
    id: 'orderedList',
    matches: isType('orderedList'),
    feature: 'orderedList',
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/orderedList', defaultText: '番号付きリスト' },
    keywords: ['ol', 'list', 'number', 'りすと', 'ばんごう'],
    icon: FaListOlIcon,
    creation: { type: 'command', apply: (chain) => chain.toggleOrderedList() },
  },
  {
    id: 'blockquote',
    matches: isType('blockquote'),
    feature: 'blockquote',
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/blockquote', defaultText: '引用' },
    keywords: ['quote', 'blockquote', 'いんよう'],
    icon: FaQuoteLeftIcon,
    creation: { type: 'command', apply: (chain) => chain.setBlockquote() },
  },
  {
    id: 'codeBlock',
    matches: isType('codeBlock'),
    feature: 'codeBlock',
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/codeBlock', defaultText: 'コードブロック' },
    keywords: ['code', 'pre', 'こーど'],
    icon: FaFileCodeIcon,
    creation: { type: 'command', apply: (chain) => chain.setCodeBlock() },
  },
  {
    id: 'horizontalRule',
    matches: isType('horizontalRule'),
    feature: 'horizontalRule',
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/horizontalRule', defaultText: '水平線' },
    keywords: ['hr', 'divider', 'line', 'すいへいせん', 'くぎりせん'],
    icon: FaMinusIcon,
    creation: { type: 'command', apply: (chain) => chain.setHorizontalRule() },
  },
  {
    id: 'table',
    matches: isType('table'),
    feature: 'table',
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/tableInsert', defaultText: '表を挿入' },
    keywords: ['table', 'ひょう', 'てーぶる'],
    icon: FaTableIcon,
    // 大きさを尋ねるダイアログを開かないのは、行と列は入れたあとに表のメニューで増減できるため
    creation: {
      type: 'command',
      apply: (chain) => chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    },
  },
  {
    id: 'image',
    matches: isType('image'),
    feature: 'image',
    group: 'media',
    label: { id: 'smarthr-ui/RichTextEditor/image', defaultText: '画像を挿入' },
    keywords: ['image', 'img', 'picture', 'がぞう', 'しゃしん'],
    icon: FaImageIcon,
    creation: { type: 'dialog', dialog: 'image' },
  },
  {
    id: 'youtube',
    matches: isType('youtube'),
    feature: 'youtube',
    group: 'media',
    label: { id: 'smarthr-ui/RichTextEditor/youtube', defaultText: 'YouTube動画を埋め込む' },
    keywords: ['youtube', 'ゆーちゅーぶ', 'どうが'],
    icon: FaCirclePlayIcon,
    creation: { type: 'dialog', dialog: 'youtube' },
  },
  {
    id: 'video',
    matches: isType('video'),
    feature: 'video',
    group: 'media',
    label: { id: 'smarthr-ui/RichTextEditor/video', defaultText: '動画を挿入' },
    keywords: ['video', 'movie', 'どうが'],
    icon: VideoIcon,
    creation: { type: 'dialog', dialog: 'video' },
  },
]

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
