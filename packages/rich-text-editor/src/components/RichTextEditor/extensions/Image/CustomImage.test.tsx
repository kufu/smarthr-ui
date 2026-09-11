import { fireEvent, render, renderHook, waitFor } from '@testing-library/react'
import { EditorContent } from '@tiptap/react'
import { beforeAll, describe, expect, it } from 'vitest'

import { useRichTextEditor } from '../../hooks/useRichTextEditor'

import type { RichTextJSON } from '../../types'
import type { Editor } from '@tiptap/react'

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
      // 高さは縦横比に従わせる（表示幅が縮んでも潰れないようにするため）
      expect(img.style.height).toBe('auto')
      expect(img.style.aspectRatio).toBe('2')
    })

    // モデルも一致していること（従来から正しい挙動）
    expect(editor.getHTML()).toContain('alt="NEWALT"')
  })

  describe('表示サイズ', () => {
    const mountWithSize = async (attrs: Record<string, unknown>) => {
      const { result } = renderHook(() =>
        useRichTextEditor({
          features: ['image'],
          defaultValue: {
            type: 'doc',
            content: [{ type: 'image', attrs: { ...attrs, src: 'https://example.com/a.png' } }],
          },
        }),
      )
      await waitFor(() => expect(result.current.editor).not.toBeNull())
      render(<EditorContent editor={result.current.editor!} />)
      await waitFor(() => expect(document.querySelector('.ProseMirror img')).not.toBeNull())

      return {
        editor: result.current.editor!,
        img: document.querySelector<HTMLImageElement>('.ProseMirror img')!,
      }
    }

    // jsdom は画像を読み込まないので自然サイズを持たない
    const stubNaturalSize = (img: HTMLImageElement, width: number, height: number) => {
      Object.defineProperty(img, 'naturalWidth', { value: width, configurable: true })
      Object.defineProperty(img, 'naturalHeight', { value: height, configurable: true })
    }

    it('width と height の両方があれば保存値の比率を使う', async () => {
      const { img } = await mountWithSize({ width: 800, height: 400 })

      expect(img.style.width).toBe('800px')
      expect(img.style.height).toBe('auto')
      expect(img.style.aspectRatio).toBe('2')
    })

    it('width だけなら自然比率に従わせる', async () => {
      const { img } = await mountWithSize({ width: 600 })
      stubNaturalSize(img, 800, 400)
      fireEvent.load(img)

      expect(img.style.width).toBe('600px')
      expect(img.style.height).toBe('auto')
      expect(img.style.aspectRatio).toBe('2')
    })

    it('height だけなら自然比率から相当する幅を出す', async () => {
      const { img } = await mountWithSize({ height: 200 })
      stubNaturalSize(img, 800, 400)
      fireEvent.load(img)

      expect(img.style.width).toBe('400px')
      expect(img.style.height).toBe('auto')
      expect(img.style.aspectRatio).toBe('2')
    })

    it('両方なしなら何も指定しない', async () => {
      const { img } = await mountWithSize({})
      stubNaturalSize(img, 800, 400)
      fireEvent.load(img)

      expect(img.style.width).toBe('')
      expect(img.style.height).toBe('')
      expect(img.style.aspectRatio).toBe('')
    })

    it('リセットすると以前の指定が消える', async () => {
      const { editor, img } = await mountWithSize({ width: 800, height: 400 })
      expect(img.style.width).toBe('800px')

      editor
        .chain()
        .setNodeSelection(0)
        .updateAttributes('image', { width: null, height: null })
        .run()

      await waitFor(() => {
        const updated = document.querySelector<HTMLImageElement>('.ProseMirror img')!

        expect(updated.style.width).toBe('')
        expect(updated.style.height).toBe('')
        expect(updated.style.aspectRatio).toBe('')
      })
    })
  })

  describe('読み込みに失敗した画像', () => {
    const mountImage = async () => {
      const { result } = renderHook(() => useRichTextEditor({ features: ['image'], defaultValue }))
      await waitFor(() => expect(result.current.editor).not.toBeNull())
      const editor = result.current.editor!

      render(<EditorContent editor={editor} />)
      await waitFor(() => expect(document.querySelector('.ProseMirror img')).not.toBeNull())

      const img = document.querySelector<HTMLImageElement>('.ProseMirror img')!

      return { editor, img, container: img.closest<HTMLElement>('[data-resize-container]')! }
    }

    const findImagePos = (editor: Editor) => {
      let imagePos: number | null = null
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'image') {
          imagePos = pos
          return false
        }
        return true
      })

      return imagePos!
    }

    it('読み込み完了までは非表示・操作不能になっている', async () => {
      const { container } = await mountImage()
      expect(container.style.visibility).toBe('hidden')
      expect(container.style.pointerEvents).toBe('none')
    })

    it('読み込みに失敗しても表示・操作可能な状態へ戻る', async () => {
      const { img, container } = await mountImage()

      img.dispatchEvent(new Event('error'))

      expect(container.style.visibility).toBe('')
      expect(container.style.pointerEvents).toBe('')
    })

    it('読み込みに失敗した画像には失敗を示す目印が付く', async () => {
      const { img } = await mountImage()

      img.dispatchEvent(new Event('error'))

      expect(img).toHaveAttribute('data-image-error', 'true')
    })

    it('読み込みに成功した画像には失敗の目印が付かない', async () => {
      const { img, container } = await mountImage()

      img.dispatchEvent(new Event('load'))

      expect(container.style.visibility).toBe('')
      expect(img).not.toHaveAttribute('data-image-error')
    })

    // NOTE: 属性を更新すると ProseMirror は NodeView を作り直して <img> 要素ごと
    // 差し替えるため、掴んだ要素ではなく都度DOMを引き直して検証する。
    it('src を差し替えると失敗の目印が外れる', async () => {
      const { editor, img } = await mountImage()

      img.dispatchEvent(new Event('error'))
      expect(img).toHaveAttribute('data-image-error', 'true')

      editor
        .chain()
        .setNodeSelection(findImagePos(editor))
        .updateAttributes('image', { src: 'https://example.com/retry.png' })
        .run()

      await waitFor(() => {
        const current = document.querySelector<HTMLImageElement>('.ProseMirror img')!
        expect(current).toHaveAttribute('src', 'https://example.com/retry.png')
        expect(current).not.toHaveAttribute('data-image-error')
      })
    })
  })
})
