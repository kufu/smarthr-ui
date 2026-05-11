import type { PDFSearchMatch } from './types'
import type { ComponentProps } from 'react'
import type { Page } from 'react-pdf'

type CustomTextRenderer = NonNullable<ComponentProps<typeof Page>['customTextRenderer']>

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}
const escapeHtml = (s: string): string => s.replace(/[&<>"']/g, (c) => HTML_ESCAPE_MAP[c]!)

const buildMarkHtml = (text: string, isCurrent: boolean, globalIndex: number): string => {
  const className = isCurrent ? 'highlight selected' : 'highlight'
  return `<mark class="${className}" data-shr-match-index="${globalIndex}">${escapeHtml(text)}</mark>`
}

const renderHighlightedFragment = (
  str: string,
  itemMatches: PDFSearchMatch[],
  currentMatchIndex: number | undefined,
): string => {
  const parts: string[] = []
  let cursor = 0
  for (const { matchStart, matchLength, globalIndex } of itemMatches) {
    parts.push(escapeHtml(str.slice(cursor, matchStart)))
    parts.push(
      buildMarkHtml(
        str.slice(matchStart, matchStart + matchLength),
        globalIndex === currentMatchIndex,
        globalIndex,
      ),
    )
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

export const buildCustomTextRenderer = (
  matches: PDFSearchMatch[],
  currentMatchIndex: number | undefined,
): CustomTextRenderer => {
  const groups = groupMatchesByItem(matches)
  return ({ pageIndex, itemIndex, str }) => {
    const itemMatches = groups.get(`${pageIndex}:${itemIndex}`)
    if (!itemMatches) return escapeHtml(str)
    return renderHighlightedFragment(str, itemMatches, currentMatchIndex)
  }
}
