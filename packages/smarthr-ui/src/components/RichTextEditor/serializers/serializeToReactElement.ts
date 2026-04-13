import { type ReactNode, createElement } from 'react'

import type { RichTextJSON } from '../types'
import type { JSONContent } from '@tiptap/core'

type JSONMark = {
  type: string
  attrs?: Record<string, unknown>
}

export const serializeToReactElement = (json: RichTextJSON): ReactNode => {
  if (!json.content) return null
  return json.content.map((node: JSONContent, i: number) => renderNode(node, i))
}

const renderNode = (node: JSONContent, key: number): ReactNode => {
  switch (node.type) {
    case 'doc':
      return serializeToReactElement(node)
    case 'paragraph':
      return createElement('p', { key }, renderChildren(node))
    case 'heading': {
      const level = Math.min(Math.max(Number(node.attrs?.level) || 2, 1), 4)
      return createElement(`h${level}`, { key }, renderChildren(node))
    }
    case 'bulletList':
      return createElement('ul', { key }, renderChildren(node))
    case 'orderedList':
      return createElement(
        'ol',
        { key, start: (node.attrs?.start as number) ?? 1 },
        renderChildren(node),
      )
    case 'listItem':
      return createElement('li', { key }, renderChildren(node))
    case 'blockquote':
      return createElement('blockquote', { key }, renderChildren(node))
    case 'codeBlock':
      return createElement('pre', { key }, createElement('code', null, renderChildren(node)))
    case 'horizontalRule':
      return createElement('hr', { key })
    case 'hardBreak':
      return createElement('br', { key })
    case 'text':
      return renderTextWithMarks(node.text ?? '', node.marks as JSONMark[] | undefined, key)
    default:
      return renderChildren(node)
  }
}

const renderChildren = (node: JSONContent): ReactNode => {
  if (!node.content) return null
  const children = node.content.map((child: JSONContent, i: number) => renderNode(child, i))
  return children.length === 1 ? children[0] : children
}

const renderTextWithMarks = (
  text: string,
  marks: JSONMark[] | undefined,
  key: number,
): ReactNode => {
  if (!marks || marks.length === 0) return text

  let result: ReactNode = text

  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
        result = createElement('strong', { key: `${key}-bold` }, result)
        break
      case 'italic':
        result = createElement('em', { key: `${key}-italic` }, result)
        break
      case 'underline':
        result = createElement('u', { key: `${key}-underline` }, result)
        break
      case 'strike':
        result = createElement('s', { key: `${key}-strike` }, result)
        break
      case 'code':
        result = createElement('code', { key: `${key}-code` }, result)
        break
      case 'link': {
        const href = typeof mark.attrs?.href === 'string' ? mark.attrs.href : ''
        const isSafe = /^https?:\/\/|^mailto:/i.test(href)
        result = createElement(
          'a',
          {
            key: `${key}-link`,
            href: isSafe ? href : undefined,
            target: mark.attrs?.target as string | undefined,
            rel: 'noopener noreferrer',
          },
          result,
        )
        break
      }
    }
  }

  return result
}
