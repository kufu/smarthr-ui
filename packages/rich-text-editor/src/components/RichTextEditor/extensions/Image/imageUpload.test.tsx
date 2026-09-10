import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import { IntlProvider } from 'smarthr-ui'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'

import type { ImageUploadResult, RichTextEditorController, RichTextJSON } from '../../types'
import type { ReactNode } from 'react'

// jsdom には ResizeObserver が無く、挿入された画像の NodeView(useActiveImageRect) が
// マウント時に参照するため、最小限のスタブを用意する。
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const getFileInput = () => {
  const fileInput = document.querySelector<HTMLInputElement>('input[name="imageFile"]')
  expect(fileInput).not.toBeNull()
  return fileInput as HTMLInputElement
}

// jsdom には DataTransfer が無いため、ProseMirror が読む分だけを持つ clipboardData を
// 組み立てて paste を発火させる。
const paste = ({
  files = [],
  html = '',
  text = '',
}: {
  files?: File[]
  html?: string
  text?: string
}) => {
  fireEvent.paste(screen.getByRole('textbox'), {
    clipboardData: {
      files,
      types: [...(files.length > 0 ? ['Files'] : []), 'text/html', 'text/plain'],
      getData: (type: string) => (type === 'text/html' ? html : text),
    },
  })
}

const pasteFile = (file: File) => paste({ files: [file] })

const createDeferred = () => {
  let resolve!: (value: ImageUploadResult) => void
  const promise = new Promise<ImageUploadResult>((res) => {
    resolve = res
  })

  return { promise, resolve }
}

/** resolve 済みのアップロードの後続処理（マイクロタスク）を流し切る */
const flush = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)))

const pngFile = () => new File(['x'], 'a.png', { type: 'image/png' })

const imageSrcs = () =>
  Array.from(document.querySelectorAll<HTMLImageElement>('.ProseMirror img')).map((img) =>
    img.getAttribute('src'),
  )

describe('画像アップロード', () => {
  it('成功時に画像がエディタへ挿入される', async () => {
    const onImageUpload = vi.fn().mockResolvedValue({ src: 'https://example.com/a.png' })
    render(<RichTextEditor features={['image']} onImageUpload={onImageUpload} />, {
      wrapper: Wrapper,
    })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    const file = new File(['x'], 'a.png', { type: 'image/png' })
    // ファイル input は aria-hidden / shr-hidden のため userEvent.upload が拒否する。
    // fireEvent.change で onChange を直接発火させる。
    fireEvent.change(getFileInput(), { target: { files: [file] } })

    await waitFor(() => {
      expect(onImageUpload).toHaveBeenCalledTimes(1)
      expect(document.querySelector('.ProseMirror img')).not.toBeNull()
    })
    expect(document.querySelector<HTMLImageElement>('.ProseMirror img')?.getAttribute('src')).toBe(
      'https://example.com/a.png',
    )
  })

  it('失敗時に onImageUploadError が呼ばれ、画像は挿入されない', async () => {
    const onImageUpload = vi.fn().mockRejectedValue(new Error('boom'))
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
    fireEvent.change(getFileInput(), { target: { files: [file] } })

    await waitFor(() => {
      expect(onImageUploadError).toHaveBeenCalledTimes(1)
    })
    expect(document.querySelector('.ProseMirror img')).toBeNull()
  })

  it('acceptedMimeTypes に一致しないファイルはファイル選択からも受け付けない', async () => {
    const onImageUpload = vi.fn().mockResolvedValue({ src: 'https://example.com/a.png' })
    render(
      <RichTextEditor
        features={['image']}
        acceptedMimeTypes={['image/*']}
        onImageUpload={onImageUpload}
      />,
      { wrapper: Wrapper },
    )
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    // accept 属性はダイアログの絞り込みヒントでしかなく、利用者は任意のファイルを選べる
    const file = new File(['x'], 'a.pdf', { type: 'application/pdf' })
    fireEvent.change(getFileInput(), { target: { files: [file] } })

    await waitFor(() => {
      expect(document.querySelector('.ProseMirror')).not.toBeNull()
    })
    expect(onImageUpload).not.toHaveBeenCalled()
  })

  it('acceptedMimeTypes のワイルドカードが貼り付けにも効く', async () => {
    const onImageUpload = vi.fn().mockResolvedValue({ src: 'https://example.com/pasted.png' })
    render(
      <RichTextEditor
        features={['image']}
        acceptedMimeTypes={['image/*']}
        onImageUpload={onImageUpload}
      />,
      { wrapper: Wrapper },
    )
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    pasteFile(new File(['x'], 'a.png', { type: 'image/png' }))

    await waitFor(() => {
      expect(onImageUpload).toHaveBeenCalledTimes(1)
    })
  })

  it('acceptedMimeTypes に一致しないファイルの貼り付けは無視される', async () => {
    const onImageUpload = vi.fn().mockResolvedValue({ src: 'https://example.com/pasted.png' })
    render(
      <RichTextEditor
        features={['image']}
        acceptedMimeTypes={['image/*']}
        onImageUpload={onImageUpload}
      />,
      { wrapper: Wrapper },
    )
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    pasteFile(new File(['x'], 'a.pdf', { type: 'application/pdf' }))

    await waitFor(() => {
      expect(document.querySelector('.ProseMirror')).not.toBeNull()
    })
    expect(onImageUpload).not.toHaveBeenCalled()
  })
})

describe('アップロード中の表示', () => {
  it('アップロード中だけプレースホルダが表示される', async () => {
    const deferred = createDeferred()
    const onImageUpload = vi.fn(() => deferred.promise)
    render(<RichTextEditor features={['image']} onImageUpload={onImageUpload} />, {
      wrapper: Wrapper,
    })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    fireEvent.change(getFileInput(), { target: { files: [pngFile()] } })

    const placeholder = await screen.findByRole('status')
    expect(placeholder).toHaveClass('smarthr-ui-RichTextEditor-imageUploadPlaceholder')

    deferred.resolve({ src: 'https://example.com/a.png' })
    await flush()

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(imageSrcs()).toEqual(['https://example.com/a.png'])
  })
})

describe('アップロード中の文書差し替え', () => {
  it('clear() したら完了後も画像を挿入しない', async () => {
    const deferred = createDeferred()
    const onImageUpload = vi.fn(() => deferred.promise)
    const ref = createRef<RichTextEditorController>()
    render(<RichTextEditor ref={ref} features={['image']} onImageUpload={onImageUpload} />, {
      wrapper: Wrapper,
    })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    fireEvent.change(getFileInput(), { target: { files: [pngFile()] } })
    await waitFor(() => expect(onImageUpload).toHaveBeenCalledTimes(1))

    act(() => ref.current?.clear())
    deferred.resolve({ src: 'https://example.com/a.png' })
    await flush()

    expect(imageSrcs()).toHaveLength(0)
  })

  it('value が差し替わったら完了後も画像を挿入しない', async () => {
    const deferred = createDeferred()
    const onImageUpload = vi.fn(() => deferred.promise)
    const doc = (text: string): RichTextJSON => ({
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
    })
    const { rerender } = render(
      <RichTextEditor value={doc('before')} features={['image']} onImageUpload={onImageUpload} />,
      { wrapper: Wrapper },
    )
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    fireEvent.change(getFileInput(), { target: { files: [pngFile()] } })
    await waitFor(() => expect(onImageUpload).toHaveBeenCalledTimes(1))

    rerender(
      <RichTextEditor value={doc('after')} features={['image']} onImageUpload={onImageUpload} />,
    )
    deferred.resolve({ src: 'https://example.com/a.png' })
    await flush()

    expect(imageSrcs()).toHaveLength(0)
    expect(screen.getByRole('textbox')).toHaveTextContent('after')
  })

  it('unmount 後に完了してもエラーにならない', async () => {
    const deferred = createDeferred()
    const onImageUpload = vi.fn(() => deferred.promise)
    const onImageUploadError = vi.fn()
    const { unmount } = render(
      <RichTextEditor
        features={['image']}
        onImageUpload={onImageUpload}
        onImageUploadError={onImageUploadError}
      />,
      { wrapper: Wrapper },
    )
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    fireEvent.change(getFileInput(), { target: { files: [pngFile()] } })
    await waitFor(() => expect(onImageUpload).toHaveBeenCalledTimes(1))

    unmount()
    deferred.resolve({ src: 'https://example.com/a.png' })
    await flush()

    expect(onImageUploadError).not.toHaveBeenCalled()
  })
})
