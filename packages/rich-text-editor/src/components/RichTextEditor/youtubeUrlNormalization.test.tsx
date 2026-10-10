import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editor } from '@tiptap/core'
import { renderToStaticMarkup } from 'react-dom/server'
import { IntlProvider } from 'smarthr-ui'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from './RichTextEditor/RichTextEditor'
import { ALL_FEATURES, configureExtensions } from './extensions/configureExtensions'
import { normalizeYoutubeUrl } from './extensions/youtubeUrl'
import { serializeToHTML } from './serializers/serializeToHTML'
import { serializeToReactElement } from './serializers/serializeToReactElement'
import { toEditorContent } from './serializers/toEditorContent'

import type { RichTextJSON } from './types'
import type { JSONContent } from '@tiptap/core'
import type { ReactElement, ReactNode } from 'react'

const CANONICAL_URL = 'https://www.youtube.com/watch?v=abcdefghijk'

// isValidYoutubeUrl は通るが、出力側の許可リストに無い表記
const VARIANT_URLS = [
  ['m. サブドメイン', 'https://m.youtube.com/watch?v=abcdefghijk'],
  ['music. サブドメイン', 'https://music.youtube.com/watch?v=abcdefghijk'],
  ['プロトコル相対', '//www.youtube.com/watch?v=abcdefghijk'],
  ['プロトコル省略', 'www.youtube.com/watch?v=abcdefghijk'],
  ['youtu.be の共有クエリ付き', 'https://youtu.be/abcdefghijk?si=xyz'],
  ['shorts', 'https://www.youtube.com/shorts/abcdefghijk'],
  ['embed', 'https://www.youtube-nocookie.com/embed/abcdefghijk'],
] as const

// jsdom に無く、Tiptap の貼り付けルールが生成する
beforeAll(() => {
  if (typeof globalThis.ClipboardEvent === 'undefined') {
    vi.stubGlobal('ClipboardEvent', class extends Event {})
  }
  if (typeof globalThis.DataTransfer === 'undefined') {
    vi.stubGlobal('DataTransfer', class {})
  }
})

afterAll(() => {
  vi.unstubAllGlobals()
})

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const findYoutubeSrc = (json: JSONContent): unknown =>
  json.type === 'youtube'
    ? json.attrs?.src
    : json.content?.map(findYoutubeSrc).find((src) => src !== undefined)

const iframeSrc = (html: string): string | null =>
  html.match(/<iframe[^>]*\ssrc="([^"]*)"/)?.[1] ?? null

const expectEmbedded = (json: RichTextJSON) => {
  const viewerSrc = iframeSrc(renderToStaticMarkup(serializeToReactElement(json) as ReactElement))

  expect(viewerSrc).toContain('/embed/abcdefghijk')
  expect(iframeSrc(serializeToHTML(json))).toBe(viewerSrc)
}

describe('YouTube URL の入力時の正規化', () => {
  it.each(VARIANT_URLS)('ツールバーから %s を埋め込むと正規の URL で保存される', async (_, url) => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RichTextEditor features={['youtube']} onChange={onChange} />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: 'YouTube動画を埋め込む' }))
    const urlInput = screen.getByRole('textbox', { name: /^YouTube URL/ })
    await waitFor(() => expect(urlInput).toHaveFocus())
    await user.type(urlInput, url)
    await user.click(screen.getByRole('button', { name: '埋め込む' }))

    await waitFor(() => expect(onChange).toHaveBeenCalled())
    const json = onChange.mock.lastCall![0] as RichTextJSON

    expect(findYoutubeSrc(json)).toBe(CANONICAL_URL)
    expectEmbedded(json)
  })

  it.each(VARIANT_URLS)('%s を貼り付けると正規の URL で保存される', (_, url) => {
    const editor = new Editor({ extensions: configureExtensions({ features: ALL_FEATURES }) })
    editor.view.pasteText(url)
    const json = editor.getJSON() as RichTextJSON
    editor.destroy()

    expect(findYoutubeSrc(json)).toBe(CANONICAL_URL)
    expectEmbedded(json)
  })

  it.each(VARIANT_URLS)('JSON で渡された %s は落とさず正規の URL へ直す', (_, url) => {
    const json = toEditorContent({
      type: 'doc',
      content: [{ type: 'youtube', attrs: { src: url } }],
    }) as RichTextJSON

    expect(findYoutubeSrc(json)).toBe(CANONICAL_URL)
    expectEmbedded(json)
  })

  describe('embed の URL の開始位置', () => {
    const EMBED_WITH_START = 'https://www.youtube-nocookie.com/embed/abcdefghijk?start=90'

    const findYoutubeStart = (json: JSONContent): unknown =>
      json.type === 'youtube'
        ? json.attrs?.start
        : json.content?.map(findYoutubeStart).find((start) => start !== undefined)

    const expectStartKept = (json: RichTextJSON) => {
      expect(findYoutubeSrc(json)).toBe(CANONICAL_URL)
      expect(findYoutubeStart(json)).toBe(90)
      expect(
        iframeSrc(renderToStaticMarkup(serializeToReactElement(json) as ReactElement)),
      ).toContain('start=90')
      expect(iframeSrc(serializeToHTML(json))).toContain('start=90')
    }

    it('JSON で渡されても開始位置を引き継ぐ', () => {
      expectStartKept(
        toEditorContent({
          type: 'doc',
          content: [{ type: 'youtube', attrs: { src: EMBED_WITH_START } }],
        }) as RichTextJSON,
      )
    })

    it('貼り付けても開始位置を引き継ぐ', () => {
      const editor = new Editor({ extensions: configureExtensions({ features: ALL_FEATURES }) })
      editor.view.pasteText(EMBED_WITH_START)
      const json = editor.getJSON() as RichTextJSON
      editor.destroy()

      expectStartKept(json)
    })

    it('ツールバーから埋め込んでも開始位置を引き継ぐ', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<RichTextEditor features={['youtube']} onChange={onChange} />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

      await user.click(screen.getByRole('button', { name: 'YouTube動画を埋め込む' }))
      const urlInput = screen.getByRole('textbox', { name: /^YouTube URL/ })
      await waitFor(() => expect(urlInput).toHaveFocus())
      await user.type(urlInput, EMBED_WITH_START)
      await user.click(screen.getByRole('button', { name: '埋め込む' }))

      await waitFor(() => expect(onChange).toHaveBeenCalled())
      expectStartKept(onChange.mock.lastCall![0] as RichTextJSON)
    })

    it.each([
      ['負の値', '-5'],
      ['数値でない値', 'abc'],
    ])('開始位置が%sなら 0 にする', (_, start) => {
      const json = toEditorContent({
        type: 'doc',
        content: [
          {
            type: 'youtube',
            attrs: { src: `https://www.youtube.com/embed/abcdefghijk?start=${start}`, start: 0 },
          },
        ],
      })

      expect(findYoutubeStart(json)).toBe(0)
    })
  })

  describe('共有 URL の t（開始位置）', () => {
    const findStart = (json: JSONContent): unknown =>
      json.type === 'youtube'
        ? json.attrs?.start
        : json.content?.map(findStart).find((start) => start !== undefined)

    it.each([
      ['youtu.be の t', 'https://youtu.be/abcdefghijk?t=90', 90],
      ['youtu.be の共有クエリと t', 'https://youtu.be/abcdefghijk?si=xyz&t=90', 90],
      ['watch の t（秒）', 'https://www.youtube.com/watch?v=abcdefghijk&t=90s', 90],
      ['watch の t（分と秒）', 'https://www.youtube.com/watch?v=abcdefghijk&t=1m30s', 90],
      ['watch の t（時と分）', 'https://www.youtube.com/watch?v=abcdefghijk&t=1h1m', 3660],
      ['watch のハッシュの t', 'https://www.youtube.com/watch?v=abcdefghijk#t=90', 90],
    ])('%s を開始位置として引き継ぐ', (_, url, expected) => {
      const json = toEditorContent({
        type: 'doc',
        content: [{ type: 'youtube', attrs: { src: url } }],
      }) as RichTextJSON

      expect(findYoutubeSrc(json)).toBe(CANONICAL_URL)
      expect(findStart(json)).toBe(expected)
      expect(iframeSrc(serializeToHTML(json))).toContain(`start=${expected}`)
    })

    it.each([
      ['大文字の単位', 'https://youtu.be/abcdefghijk?t=1M30S', 90],
      [
        'クエリの t が不正でもハッシュの t',
        'https://www.youtube.com/watch?v=abcdefghijk&t=abc#t=90',
        90,
      ],
    ])('%s も読む', (_, url, expected) => {
      expect(normalizeYoutubeUrl(url)).toEqual({ src: CANONICAL_URL, start: expected })
    })

    it.each([
      ['数値でない', 'abc'],
      ['単位の順が違う', '30s1m'],
      ['空', ''],
      ['桁が多すぎる', '9'.repeat(400)],
    ])('t が%sなら開始位置を持たない', (_, t) => {
      expect(normalizeYoutubeUrl(`https://youtu.be/abcdefghijk?t=${t}`)).toEqual({
        src: CANONICAL_URL,
      })
    })

    it('JSON に開始位置があれば、URL の t より優先する', () => {
      const json = toEditorContent({
        type: 'doc',
        content: [
          { type: 'youtube', attrs: { src: 'https://youtu.be/abcdefghijk?t=90', start: 30 } },
        ],
      }) as RichTextJSON

      expect(findYoutubeSrc(json)).toBe(CANONICAL_URL)
      expect(findStart(json)).toBe(30)
    })

    it('ツールバーから埋め込んでも開始位置を引き継ぐ', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<RichTextEditor features={['youtube']} onChange={onChange} />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

      await user.click(screen.getByRole('button', { name: 'YouTube動画を埋め込む' }))
      const urlInput = screen.getByRole('textbox', { name: /^YouTube URL/ })
      await waitFor(() => expect(urlInput).toHaveFocus())
      await user.type(urlInput, 'https://youtu.be/abcdefghijk?t=1m30s')
      await user.click(screen.getByRole('button', { name: '埋め込む' }))

      await waitFor(() => expect(onChange).toHaveBeenCalled())
      expect(findStart(onChange.mock.lastCall![0] as RichTextJSON)).toBe(90)
    })

    it('貼り付けても開始位置を引き継ぐ', () => {
      const editor = new Editor({ extensions: configureExtensions({ features: ALL_FEATURES }) })
      editor.view.pasteText('https://youtu.be/abcdefghijk?t=1m30s')
      const json = editor.getJSON() as RichTextJSON
      editor.destroy()

      expect(findStart(json)).toBe(90)
    })
  })

  it('再生リストの URL は再生リストのまま保存される', () => {
    const json = toEditorContent({
      type: 'doc',
      content: [
        { type: 'youtube', attrs: { src: 'https://m.youtube.com/playlist?list=PLabc123' } },
      ],
    })

    expect(findYoutubeSrc(json)).toBe('https://www.youtube.com/playlist?list=PLabc123')
  })

  it('動画を特定できない URL は貼り付けても埋め込みにしない', () => {
    const editor = new Editor({ extensions: configureExtensions({ features: ALL_FEATURES }) })
    editor.view.pasteText('https://www.youtube.com/v/abcdefghijk')
    const json = editor.getJSON()
    editor.destroy()

    expect(findYoutubeSrc(json)).toBeUndefined()
  })
})
