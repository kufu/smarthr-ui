import { Editor } from '@tiptap/core'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { ALL_FEATURES, configureExtensions } from '../extensions/configureExtensions'

import { serializeToHTML } from './serializeToHTML'
import { serializeToReactElement } from './serializeToReactElement'

import type { RichTextJSON } from '../types'
import type { ReactElement } from 'react'

const WATCH_URL = 'https://www.youtube.com/watch?v=abcdefghijk'

const iframeSrc = (html: string): string | null =>
  html.match(/<iframe[^>]*\ssrc="([^"]*)"/)?.[1] ?? null

const viewerSrc = (json: RichTextJSON): string | null =>
  iframeSrc(renderToStaticMarkup(serializeToReactElement(json) as ReactElement))

const insertYoutube = (src: string, start?: number): RichTextJSON => {
  const editor = new Editor({ extensions: configureExtensions({ features: ALL_FEATURES }) })
  editor.commands.setYoutubeVideo(start === undefined ? { src } : { src, start })
  const json = editor.getJSON() as RichTextJSON
  editor.destroy()

  return json
}

const youtubeDoc = (attrs: Record<string, unknown>): RichTextJSON => ({
  type: 'doc',
  content: [{ type: 'youtube', attrs }],
})

describe('Viewer の YouTube 埋め込み', () => {
  it.each([
    ['watch のURL', WATCH_URL],
    ['youtu.be のURL', 'https://youtu.be/abcdefghijk'],
    ['すでに embed のURL', 'https://www.youtube-nocookie.com/embed/abcdefghijk'],
  ])('%s を埋め込み用へ変換する', (_name, url) => {
    const src = viewerSrc(insertYoutube(url))

    expect(src).toContain('/embed/abcdefghijk')
    expect(src).not.toContain('/watch')
    expect(src).not.toContain('youtu.be')
  })

  it('開始位置がURLに反映される', () => {
    expect(viewerSrc(insertYoutube(WATCH_URL, 30))).toContain('start=30')
  })

  it.each([
    ['watch のURL', WATCH_URL],
    ['youtu.be のURL', 'https://youtu.be/abcdefghijk'],
    ['開始位置つき', WATCH_URL],
  ])('%s で HTML 出力と src が一致する', (_name, url) => {
    const json = insertYoutube(url, 15)

    expect(viewerSrc(json)).toBe(iframeSrc(serializeToHTML(json)))
  })

  it.each([
    ['javascript:', 'javascript:alert(1)'],
    ['別ドメイン', 'https://evil.example/watch?v=abcdefghijk'],
    ['youtube を名乗る別ドメイン', 'https://youtube.com.evil.example/watch?v=abcdefghijk'],
  ])('%s は iframe の src にならない', (_name, src) => {
    const html = renderToStaticMarkup(serializeToReactElement(youtubeDoc({ src })) as ReactElement)

    expect(iframeSrc(html)).toBeNull()
    expect(html).not.toContain('evil.example')
    expect(html).not.toContain('javascript:')
  })

  it('src が null でも iframe の src にならない', () => {
    const html = renderToStaticMarkup(
      serializeToReactElement(youtubeDoc({ src: null })) as ReactElement,
    )

    expect(iframeSrc(html)).toBeNull()
  })

  it('変換できないURLで元のURLへフォールバックしない', () => {
    // ドメインは許可されるが動画IDを取り出せない
    const html = renderToStaticMarkup(
      serializeToReactElement(youtubeDoc({ src: 'https://www.youtube.com/' })) as ReactElement,
    )

    expect(iframeSrc(html)).toBeNull()
  })

  it('開始位置が不正でもURLを壊さない', () => {
    const src = viewerSrc(youtubeDoc({ src: WATCH_URL, start: Number.NaN }))

    expect(src).toContain('/embed/abcdefghijk')
    expect(src).not.toContain('NaN')
  })
})

describe('YouTube の iframe の属性', () => {
  const iframeAttrs = (root: ParentNode) => {
    const iframe = root.querySelector('iframe')!

    return { allow: iframe.getAttribute('allow'), sandbox: iframe.getAttribute('sandbox') }
  }

  const parse = (html: string) => new DOMParser().parseFromString(html, 'text/html')

  it('エディタ・HTML 出力・Viewer で同じ属性になる', () => {
    const json = insertYoutube(WATCH_URL)

    const element = document.createElement('div')
    const editor = new Editor({
      element,
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: json,
    })
    const inEditor = iframeAttrs(editor.view.dom)
    editor.destroy()

    const inHTML = iframeAttrs(parse(serializeToHTML(json)))
    const inViewer = iframeAttrs(
      parse(renderToStaticMarkup(serializeToReactElement(json) as ReactElement)),
    )

    expect(inHTML).toEqual(inEditor)
    expect(inViewer).toEqual(inEditor)
  })

  it('再生に必要な権限を許可する', () => {
    const { allow } = iframeAttrs(parse(serializeToHTML(insertYoutube(WATCH_URL))))

    expect(allow).toContain('autoplay')
    expect(allow).toContain('encrypted-media')
    expect(allow).toContain('picture-in-picture')
  })

  it('sandbox を付けない', () => {
    expect(iframeAttrs(parse(serializeToHTML(insertYoutube(WATCH_URL)))).sandbox).toBeNull()
  })
})
