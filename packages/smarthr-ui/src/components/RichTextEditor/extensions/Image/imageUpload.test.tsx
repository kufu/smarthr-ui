import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { IntlProvider } from '../../../../intl'
import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'

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
})
