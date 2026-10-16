import { render, screen, waitFor } from '@testing-library/react'
import { IntlProvider } from 'smarthr-ui'
import { describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import type { ReactNode } from 'react'

const contextReads = vi.hoisted(() => ({ count: 0 }))

vi.mock('./RichTextEditorContext', async (importOriginal) => {
  const actual = (await importOriginal()) as { useRichTextEditorContext: () => unknown }

  return {
    ...actual,
    useRichTextEditorContext: () => {
      contextReads.count++

      return actual.useRichTextEditorContext()
    },
  }
})

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

// 利用者がインラインで配列や関数を書き、親の都合で再レンダーした状況
const renderEditor = () => (
  <RichTextEditor
    features={['bold', 'heading', 'image']}
    headingLevels={[1, 2]}
    acceptedMimeTypes={['image/png']}
    onImageUpload={async () => ({ src: 'https://example.com/a.png' })}
    onImageUploadError={() => {}}
  />
)

describe('RichTextEditorProvider', () => {
  it('同じ内容の props で再レンダーされても、ツールバーの部品を描画し直さない', async () => {
    const { rerender } = render(renderEditor(), { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByRole('toolbar')).toBeInTheDocument())

    const before = contextReads.count
    rerender(renderEditor())

    expect(contextReads.count).toBe(before)
  })

  it('features が変わったらツールバーに反映する', async () => {
    const { rerender } = render(<RichTextEditor features={['bold']} />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByRole('toolbar')).toBeInTheDocument())

    rerender(<RichTextEditor features={['bold', 'italic']} />)

    expect(await screen.findByRole('button', { name: '斜体' })).toBeInTheDocument()
  })

  it('差し替えた onImageUpload を使う', async () => {
    const first = vi.fn(async () => ({ src: 'https://example.com/first.png' }))
    const second = vi.fn(async () => ({ src: 'https://example.com/second.png' }))
    const { rerender } = render(<RichTextEditor features={['image']} onImageUpload={first} />, {
      wrapper: Wrapper,
    })
    await waitFor(() => expect(screen.getByRole('toolbar')).toBeInTheDocument())

    rerender(<RichTextEditor features={['image']} onImageUpload={second} />)
    const fileInput = document.querySelector<HTMLInputElement>('input[name="imageFile"]')!
    const file = new File(['x'], 'a.png', { type: 'image/png' })
    Object.defineProperty(fileInput, 'files', { value: [file], configurable: true })
    fileInput.dispatchEvent(new Event('change', { bubbles: true }))

    await waitFor(() => expect(second).toHaveBeenCalledTimes(1))
    expect(first).not.toHaveBeenCalled()
  })

  it.each([
    ['差し替えた', vi.fn()],
    ['外した', undefined],
  ])(
    'アップロード中に onImageUploadError を%s場合も、開始時の関数へ失敗を通知する',
    async (_, next) => {
      let reject!: (error: Error) => void
      const onImageUpload = () =>
        new Promise<{ src: string }>((_resolve, rej) => {
          reject = rej
        })
      const first = vi.fn()
      const { rerender } = render(
        <RichTextEditor
          features={['image']}
          onImageUpload={onImageUpload}
          onImageUploadError={first}
        />,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByRole('toolbar')).toBeInTheDocument())

      const fileInput = document.querySelector<HTMLInputElement>('input[name="imageFile"]')!
      const file = new File(['x'], 'a.png', { type: 'image/png' })
      Object.defineProperty(fileInput, 'files', { value: [file], configurable: true })
      fileInput.dispatchEvent(new Event('change', { bubbles: true }))

      rerender(
        <RichTextEditor
          features={['image']}
          onImageUpload={onImageUpload}
          onImageUploadError={next}
        />,
      )
      reject(new Error('failed'))

      await waitFor(() => expect(first).toHaveBeenCalledTimes(1))
      expect(next ?? vi.fn()).not.toHaveBeenCalled()
    },
  )
})
