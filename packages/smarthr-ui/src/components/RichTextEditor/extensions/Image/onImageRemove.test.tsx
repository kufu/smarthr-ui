import { render, renderHook, waitFor } from '@testing-library/react'
import { EditorContent } from '@tiptap/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { useRichTextEditor } from '../../hooks/useRichTextEditor'

import { collectImageSrcs } from './collectImageSrcs'

import type { RichTextJSON } from '../../types'

// jsdom には ResizeObserver が無く、画像 NodeView がマウント時に参照するためスタブする。
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
  }
})

const SRC_A = 'https://example.com/a.png'
const SRC_B = 'https://example.com/b.png'

const singleImageValue: RichTextJSON = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'image', attrs: { src: SRC_A, alt: 'A' } }],
    },
  ],
}

const twoImagesValue: RichTextJSON = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'image', attrs: { src: SRC_A, alt: 'A' } },
        { type: 'image', attrs: { src: SRC_B, alt: 'B' } },
      ],
    },
  ],
}

const findImagePos = (editor: NonNullable<ReturnType<typeof useRichTextEditor>['editor']>) => {
  let pos: number | null = null
  editor.state.doc.descendants((node, p) => {
    if (node.type.name === 'image') {
      pos = p
      return false
    }
    return true
  })
  return pos
}

describe('onImageRemove', () => {
  it('image ノード削除時に src で1回呼ばれる', async () => {
    const onImageRemove = vi.fn()
    const { result } = renderHook(() =>
      useRichTextEditor({ features: ['image'], defaultValue: singleImageValue, onImageRemove }),
    )

    await waitFor(() => expect(result.current.editor).not.toBeNull())
    const editor = result.current.editor!
    render(<EditorContent editor={editor} />)

    await waitFor(() => {
      expect(document.querySelector('.ProseMirror img')).not.toBeNull()
    })

    const pos = findImagePos(editor)
    expect(pos).not.toBeNull()

    editor.chain().setNodeSelection(pos!).deleteSelection().run()

    expect(onImageRemove).toHaveBeenCalledTimes(1)
    expect(onImageRemove).toHaveBeenCalledWith(SRC_A)
  })

  it('clearContent でも削除が検知される', async () => {
    const onImageRemove = vi.fn()
    const { result } = renderHook(() =>
      useRichTextEditor({ features: ['image'], defaultValue: singleImageValue, onImageRemove }),
    )

    await waitFor(() => expect(result.current.editor).not.toBeNull())
    const editor = result.current.editor!
    render(<EditorContent editor={editor} />)

    await waitFor(() => {
      expect(document.querySelector('.ProseMirror img')).not.toBeNull()
    })

    editor.commands.clearContent()

    expect(onImageRemove).toHaveBeenCalledTimes(1)
    expect(onImageRemove).toHaveBeenCalledWith(SRC_A)
  })

  it('複数画像を一度に削除すると src ごとに呼ばれる', async () => {
    const onImageRemove = vi.fn()
    const { result } = renderHook(() =>
      useRichTextEditor({ features: ['image'], defaultValue: twoImagesValue, onImageRemove }),
    )

    await waitFor(() => expect(result.current.editor).not.toBeNull())
    const editor = result.current.editor!
    render(<EditorContent editor={editor} />)

    await waitFor(() => {
      expect(document.querySelector('.ProseMirror img')).not.toBeNull()
    })
    // モデル上に2画像あることを確認してから削除する
    expect(collectImageSrcs(editor.state.doc)).toEqual([SRC_A, SRC_B])

    editor.commands.clearContent()

    expect(onImageRemove).toHaveBeenCalledTimes(2)
    const calledSrcs = onImageRemove.mock.calls.map((c) => c[0])
    expect(calledSrcs).toContain(SRC_A)
    expect(calledSrcs).toContain(SRC_B)
  })

  it('画像を含まない変更では呼ばれない', async () => {
    const onImageRemove = vi.fn()
    const { result } = renderHook(() =>
      useRichTextEditor({ features: ['image'], defaultValue: singleImageValue, onImageRemove }),
    )

    await waitFor(() => expect(result.current.editor).not.toBeNull())
    const editor = result.current.editor!
    render(<EditorContent editor={editor} />)

    await waitFor(() => {
      expect(document.querySelector('.ProseMirror img')).not.toBeNull()
    })

    // 末尾にテキストを追加するだけ（画像は残る）
    editor.commands.insertContentAt(editor.state.doc.content.size, ' text')

    expect(onImageRemove).not.toHaveBeenCalled()
    // 画像はまだ存在する
    expect(collectImageSrcs(editor.state.doc)).toEqual([SRC_A])
  })
})
