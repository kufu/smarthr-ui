import { render, renderHook, waitFor } from '@testing-library/react'
import { EditorContent } from '@tiptap/react'
import { beforeAll, describe, expect, it } from 'vitest'

import { useRichTextEditor } from '../../hooks/useRichTextEditor'

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

const defaultValue: RichTextJSON = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'image',
          attrs: { src: 'https://example.com/a.png', alt: 'OLD', width: 300, height: 200 },
        },
      ],
    },
  ],
}

describe('CustomImage NodeView', () => {
  it('updateAttributes で alt と width/height が画面上の <img> へ同期される', async () => {
    const { result } = renderHook(() => useRichTextEditor({ features: ['image'], defaultValue }))

    // editor 生成を待つ
    await waitFor(() => expect(result.current.editor).not.toBeNull())
    const editor = result.current.editor!

    // EditorContent を実描画して NodeView を DOM へマウントする
    render(<EditorContent editor={editor} />)

    await waitFor(() => {
      expect(document.querySelector('.ProseMirror img')).not.toBeNull()
    })

    // 初期状態の確認
    const imgBefore = document.querySelector<HTMLImageElement>('.ProseMirror img')!
    expect(imgBefore.getAttribute('alt')).toBe('OLD')

    // image ノードの位置を特定して updateAttributes を実行
    let imagePos: number | null = null
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'image') {
        imagePos = pos
        return false
      }
      return true
    })
    expect(imagePos).not.toBeNull()

    editor
      .chain()
      .setNodeSelection(imagePos!)
      .updateAttributes('image', { alt: 'NEWALT', width: 222, height: 111 })
      .run()

    // DOM へ同期されていること（alt 属性 と style.width/height の両方）
    await waitFor(() => {
      const img = document.querySelector<HTMLImageElement>('.ProseMirror img')!
      expect(img.getAttribute('alt')).toBe('NEWALT')
      expect(img.style.width).toBe('222px')
      expect(img.style.height).toBe('111px')
    })

    // モデルも一致していること（従来から正しい挙動）
    expect(editor.getHTML()).toContain('alt="NEWALT"')
  })
})
