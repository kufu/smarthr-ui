import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { IntlProvider } from 'smarthr-ui'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'
import { serializeToHTML } from '../../serializers/serializeToHTML'

import type { RichTextJSON } from '../../types'
import type { ReactNode } from 'react'

// jsdom には ResizeObserver が無く、画像の NodeView がマウント時に参照する
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

// 保存しても次の表示で読めない、または別オリジンを指しうる src
const UNUSABLE_SRCS = [
  ['blob:', 'blob:https://example.com/0b1c2d3e'],
  ['data:', 'data:image/png;base64,iVBORw0KGgo='],
  ['相対パス', 'uploads/a.png'],
  ['プロトコル相対', '//evil.example/a.png'],
  ['バックスラッシュ始まり', '/\\evil.example/a.png'],
  ['タブを挟んだプロトコル相対', '/\t/evil.example/a.png'],
  ['javascript:', 'javascript:alert(1)'],
] as const

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const imageDoc = (src: string): RichTextJSON => ({
  type: 'doc',
  content: [{ type: 'image', attrs: { src, alt: 'x' } }],
})

const upload = async (src: string) => {
  const onImageUpload = vi.fn().mockResolvedValue({ src })
  const onImageUploadError = vi.fn()
  render(
    <RichTextEditor
      features={['image']}
      onImageUpload={onImageUpload}
      onImageUploadError={onImageUploadError}
    />,
    { wrapper: Wrapper },
  )
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

  const file = new File(['x'], 'a.png', { type: 'image/png' })
  const fileInput = document.querySelector<HTMLInputElement>('input[name="imageFile"]')!
  fireEvent.change(fileInput, { target: { files: [file] } })
  await waitFor(() => expect(onImageUpload).toHaveBeenCalledTimes(1))

  return { file, onImageUploadError }
}

const pasteHTML = async (html: string) => {
  render(<RichTextEditor features={['image']} />, { wrapper: Wrapper })
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

  fireEvent.paste(screen.getByRole('textbox'), {
    clipboardData: {
      files: [],
      types: ['text/html', 'text/plain'],
      getData: (type: string) => (type === 'text/html' ? html : ''),
    },
  })
}

describe('画像の src の検証', () => {
  describe('アップロード結果', () => {
    it('ルート相対パスは挿入される', async () => {
      const { onImageUploadError } = await upload('/uploads/a.png')

      await waitFor(() =>
        expect(document.querySelector('.ProseMirror img')?.getAttribute('src')).toBe(
          '/uploads/a.png',
        ),
      )
      expect(onImageUploadError).not.toHaveBeenCalled()
    })

    it.each(UNUSABLE_SRCS)('%s は挿入せず onImageUploadError へ渡す', async (_, src) => {
      const { file, onImageUploadError } = await upload(src)

      await waitFor(() => expect(onImageUploadError).toHaveBeenCalledTimes(1))
      expect(onImageUploadError).toHaveBeenCalledWith(expect.any(Error), file)
      expect(document.querySelector('.ProseMirror img')).toBeNull()
    })
  })

  describe('貼り付け', () => {
    it('ルート相対パスの画像は貼り付けられる', async () => {
      await pasteHTML('<img src="/uploads/a.png" alt="x">')

      await waitFor(() =>
        expect(document.querySelector('.ProseMirror img')?.getAttribute('src')).toBe(
          '/uploads/a.png',
        ),
      )
    })

    it.each(UNUSABLE_SRCS)('%s の画像は取り込まない', async (_, src) => {
      await pasteHTML(`<p>前</p><img src="${src}" alt="x"><p>後</p>`)

      await waitFor(() => expect(screen.getByRole('textbox')).toHaveTextContent('後'))
      expect(document.querySelector('.ProseMirror img')).toBeNull()
    })
  })

  describe('出力', () => {
    it('ルート相対パスは保持される', () => {
      expect(serializeToHTML(imageDoc('/uploads/a.png'))).toContain('src="/uploads/a.png"')
    })

    it.each(UNUSABLE_SRCS)('%s は出力されない', (_, src) => {
      expect(serializeToHTML(imageDoc(src))).not.toContain(`src="${src}"`)
    })
  })
})
