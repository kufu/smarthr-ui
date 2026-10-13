import { isSafeImageSrc } from '../serializers/safeAttributes'

import { isYoutubeEmbedSrc } from './youtubeUrl'

import type { MediaAlign } from './mediaAlign'
import type { TagParseRule } from '@tiptap/pm/model'

const COLLAPSIBLE_WHITESPACE = /^[ \t\n\r\f]*$/

const isReadableMedia = (element: Element) =>
  element.tagName === 'IMG'
    ? isSafeImageSrc(element.getAttribute('src'))
    : isYoutubeEmbedSrc(element.getAttribute('src'))

const hasTextBefore = (container: Node, target: Node): boolean => {
  for (const child of Array.from(container.childNodes)) {
    if (child === target) return false
    if (child.contains(target)) return hasTextBefore(child, target)
    // コメントの textContent はコメントの中身を返すが、読み込んでも文字にならない
    if (child.nodeType === child.COMMENT_NODE) continue
    if (!COLLAPSIBLE_WHITESPACE.test(child.textContent ?? '')) return true
  }

  return false
}

// br ごとに段落全体を調べ直すと、改行の多い段落で読み込みが遅くなる
const mediaOnlyParagraphs = new WeakMap<Element, boolean>()

const judgeContainsOnlyMedia = (paragraph: Element) => {
  // &nbsp; は trim で消えるが、読み込みでは文字として残り段落になる
  if (!COLLAPSIBLE_WHITESPACE.test(paragraph.textContent ?? '')) return false

  const media = Array.from(paragraph.querySelectorAll('img, iframe'))

  return media.length > 0 && media.every(isReadableMedia)
}

const containsOnlyMedia = (paragraph: Element) => {
  let result = mediaOnlyParagraphs.get(paragraph)

  if (result === undefined) {
    result = judgeContainsOnlyMedia(paragraph)
    mediaOnlyParagraphs.set(paragraph, result)
  }

  return result
}

const isSkippableParagraph = (paragraph: Element) => {
  if (!containsOnlyMedia(paragraph)) return false

  const listItem = paragraph.closest('li')

  // リスト項目は先頭に段落を要するため、先頭の段落を読み飛ばすと中身がリストの外へ追い出される。
  // 親や兄弟の要素で判定しないのは、包みの div や空の span を挟むと先頭なのに判定から漏れるため
  return !listItem || hasTextBefore(listItem, paragraph)
}

const INLINE_DISPLAYS = new Set(['', 'inline', 'inline-block'])

const isInlineLevel = (element: HTMLElement) => {
  const float = element.style.getPropertyValue('float')

  return INLINE_DISPLAYS.has(element.style.display) && (!float || float === 'none')
}

/**
 * 文字と混ざった段落の揃えを使わないのは、画像や動画がブロックとして文字の行から外れ、
 * 揃えを移すと元の見た目と変わりうるため
 */
export const parseParagraphMediaAlign = (media: HTMLElement): MediaAlign | null => {
  const paragraph = media.closest<HTMLElement>('p')

  if (!paragraph || !containsOnlyMedia(paragraph)) return null

  // text-align はインライン表示の要素にしか効かない。段落までの間にブロック表示や float の要素があると、
  // 段落の揃えで動いていない
  for (
    let element: HTMLElement | null = media;
    element && element !== paragraph;
    element = element.parentElement
  ) {
    if (!isInlineLevel(element)) return null
  }

  const { textAlign } = paragraph.style

  return textAlign === 'center' || textAlign === 'right' ? textAlign : null
}

// br を ignore にしないのは、ProseMirror が読み飛ばした br の代わりに空の段落を作るため
export const MEDIA_ONLY_PARAGRAPH_PARSE_RULES: TagParseRule[] = [
  {
    tag: 'p',
    priority: 60,
    skip: true,
    getAttrs: (element) => (isSkippableParagraph(element) ? null : false),
  },
  {
    tag: 'br',
    priority: 60,
    skip: true,
    getAttrs: (element) => {
      const paragraph = element.closest('p')

      return paragraph && isSkippableParagraph(paragraph) ? null : false
    },
  },
]
