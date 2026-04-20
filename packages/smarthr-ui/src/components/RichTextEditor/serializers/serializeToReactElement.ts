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
    case 'image': {
      const src = typeof node.attrs?.src === 'string' ? node.attrs.src : ''
      const isSafeSrc = /^https?:\/\//i.test(src)
      return createElement('img', {
        key,
        src: isSafeSrc ? src : undefined,
        alt: (node.attrs?.alt as string) ?? '',
      })
    }
    case 'youtube': {
      const src = typeof node.attrs?.src === 'string' ? node.attrs.src : ''
      const isSafeYoutube =
        /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)\//i.test(src)
      const width = typeof node.attrs?.width === 'number' ? node.attrs.width : 640
      const height = typeof node.attrs?.height === 'number' ? node.attrs.height : 480
      return createElement(
        'div',
        { key },
        createElement('iframe', {
          src: isSafeYoutube ? src : undefined,
          width,
          height,
          allowFullScreen: true,
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          sandbox: 'allow-scripts allow-same-origin allow-popups',
          style: { border: 0, maxWidth: '100%', aspectRatio: `${width} / ${height}` },
        }),
      )
    }
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
      case 'textStyle': {
        const color = typeof mark.attrs?.color === 'string' ? mark.attrs.color : ''
        const isSafeColor =
          /^#[0-9a-f]{3,6}$/i.test(color) || /^rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)$/i.test(color)
        result = createElement(
          'span',
          {
            key: `${key}-textStyle`,
            style: isSafeColor ? { color } : undefined,
          },
          result,
        )
        break
      }
    }
  }

  return result
}
