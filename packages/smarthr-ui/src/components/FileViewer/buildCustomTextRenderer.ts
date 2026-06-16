import type { PDFSearchMatch } from './types'
import type { ComponentProps } from 'react'
import type { Page } from 'react-pdf'

type CustomTextRenderer = NonNullable<ComponentProps<typeof Page>['customTextRenderer']>

export const MATCH_INDEX_ATTR = 'data-shr-match-index'

export const SELECTED_MATCH_CLASS = 'selected'

export const matchSelector = (globalIndex: number): string =>
  `mark.highlight[${MATCH_INDEX_ATTR}="${globalIndex}"]`

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}
const replaceHtmlChar = (c: string): string => HTML_ESCAPE_MAP[c]!
const escapeHtml = (s: string): string => s.replace(/[&<>"']/g, replaceHtmlChar)

const buildMarkHtml = (text: string, globalIndex: number): string =>
  `<mark class="highlight" ${MATCH_INDEX_ATTR}="${globalIndex}">${escapeHtml(text)}</mark>`

const renderHighlightedFragment = (str: string, itemMatches: PDFSearchMatch[]): string => {
  const parts: string[] = []
  let cursor = 0
  for (const { matchStart, matchLength, globalIndex } of itemMatches) {
    parts.push(escapeHtml(str.slice(cursor, matchStart)))
    parts.push(buildMarkHtml(str.slice(matchStart, matchStart + matchLength), globalIndex))
    cursor = matchStart + matchLength
  }
  parts.push(escapeHtml(str.slice(cursor)))
  return parts.join('')
}

const groupMatchesByItem = (matches: PDFSearchMatch[]): Map<string, PDFSearchMatch[]> => {
  const groups = new Map<string, PDFSearchMatch[]>()
  for (const m of matches) {
    const key = `${m.pageIndex}:${m.itemIndex}`
    const list = groups.get(key)
    if (list) {
      list.push(m)
    } else {
      groups.set(key, [m])
    }
  }
  return groups
}

export const buildCustomTextRenderer = (matches: PDFSearchMatch[]): CustomTextRenderer => {
  const groups = groupMatchesByItem(matches)
  return ({ pageIndex, itemIndex, str }) => {
    const itemMatches = groups.get(`${pageIndex}:${itemIndex}`)
    if (!itemMatches) return escapeHtml(str)
    return renderHighlightedFragment(str, itemMatches)
  }
}
