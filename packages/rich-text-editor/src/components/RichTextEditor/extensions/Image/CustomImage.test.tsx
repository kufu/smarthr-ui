import { fireEvent, render, renderHook, waitFor } from '@testing-library/react'
import { EditorContent } from '@tiptap/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useRichTextEditor } from '../../hooks/useRichTextEditor'

import type { RichTextJSON } from '../../types'
import type { Editor } from '@tiptap/react'

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

    describe('作った時点で読み込みを終えている画像', () => {
      afterEach(() => {
        vi.restoreAllMocks()
      })

      const mockLoadState = (naturalWidth: number) => {
        vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true)
        vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(naturalWidth)
      }

      it('キャッシュから読み込めた画像は、load を待たずに表示する', async () => {
        mockLoadState(300)

        const { container } = await mountImage()

        expect(container.style.visibility).toBe('')
        expect(container.style.pointerEvents).toBe('')
      })

      it('読み込みに失敗した画像は、error が届くまで隠したままにする', async () => {
        mockLoadState(0)

        const { img, container } = await mountImage()

        expect(container.style.visibility).toBe('hidden')

        img.dispatchEvent(new Event('error'))

        expect(container.style.visibility).toBe('')
      })
    })

    it.each([
      ['null', null],
      ['空文字', ''],
    ])('src を %s にした画像は、失敗として表示・操作可能にする', async (_, src) => {
      const { editor } = await mountImage()

      editor.chain().setNodeSelection(findImagePos(editor)).updateAttributes('image', { src }).run()

      await waitFor(() => {
        const current = document.querySelector<HTMLImageElement>('.ProseMirror img')!
        expect(current).not.toHaveAttribute('src')
        expect(current).toHaveAttribute('data-image-error', 'true')
        const container = current.closest<HTMLElement>('[data-resize-container]')!
        expect(container.style.visibility).toBe('')
        expect(container.style.pointerEvents).toBe('')
      })
    })

    it('src の無い画像を入れると、失敗として表示・操作可能にする', async () => {
      const { editor } = await mountImage()

      editor.commands.setContent({
        type: 'doc',
        content: [{ type: 'image', attrs: { src: null } }],
      })

      await waitFor(() => {
        const current = document.querySelector<HTMLImageElement>('.ProseMirror img')!
        expect(current).toHaveAttribute('data-image-error', 'true')
        expect(current.closest<HTMLElement>('[data-resize-container]')!.style.visibility).toBe('')
      })
    })

    // NOTE: 属性の更新で NodeView が作り直されるか、onUpdate で再利用されるかは
    // 更新の内容で変わるため、掴んだ要素ではなく都度DOMを引き直して検証する。
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

describe('読み取り専用でのリサイズ', () => {
  const mount = async (initial: { readOnly?: boolean; disabled?: boolean }) => {
    const { result, rerender } = renderHook(
      (props: { readOnly?: boolean; disabled?: boolean }) =>
        useRichTextEditor({ ...props, features: ['image'], defaultValue }),
      { initialProps: initial },
    )
    await waitFor(() => expect(result.current.editor).not.toBeNull())
    render(<EditorContent editor={result.current.editor!} />)
    await waitFor(() => expect(document.querySelector('[data-resize-handle]')).not.toBeNull())

    return { editor: result.current.editor!, rerender }
  }

  // jsdom は寸法を持たないため、ドラッグを確定すると幅・高さが 0 で書き込まれる
  const drag = () => {
    const handle = document.querySelector<HTMLElement>('[data-resize-handle]')!
    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(document, { clientX: -100, clientY: -100 })
    fireEvent.mouseUp(document)
  }

  const imageWidth = (editor: Editor) => {
    let width: unknown
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'image') width = node.attrs.width
    })
    return width
  }

  it('ハンドルを動かさずに離しただけでは幅を書き換えない', async () => {
    const { editor } = await mount({})
    const handle = document.querySelector<HTMLElement>('[data-resize-handle]')!
    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
    fireEvent.mouseUp(document)
    expect(imageWidth(editor)).toBe(300)
  })

  it('編集できるときはドラッグで幅が書き換わる', async () => {
    const { editor } = await mount({})
    drag()
    expect(imageWidth(editor)).not.toBe(300)
  })

  it.each([
    ['readOnly', { readOnly: true }],
    ['disabled', { disabled: true }],
  ])('%s のときはドラッグしても幅が変わらない', async (_, props) => {
    const { editor } = await mount(props)
    drag()
    expect(imageWidth(editor)).toBe(300)
  })

  it('表示後に readOnly へ切り替えてもドラッグで幅が変わらない', async () => {
    const { editor, rerender } = await mount({})
    rerender({ readOnly: true })
    await waitFor(() => expect(editor.isEditable).toBe(false))
    drag()
    expect(imageWidth(editor)).toBe(300)
  })

  // 標準の NodeView は文書の更新時に編集可否を見てハンドルを外し、更新を伴わない
  // setEditable では付け直さない。アップロード完了など読み取り専用中の更新で起きる
  it('readOnly の間に文書が更新されても、編集可能へ戻すとドラッグで幅が書き換わる', async () => {
    const { editor, rerender } = await mount({})
    rerender({ readOnly: true })
    await waitFor(() => expect(editor.isEditable).toBe(false))
    editor.commands.insertContentAt(editor.state.doc.content.size, {
      type: 'paragraph',
      content: [{ type: 'text', text: '追記' }],
    })
    rerender({ readOnly: false })
    await waitFor(() => expect(editor.isEditable).toBe(true))
    drag()
    expect(imageWidth(editor)).not.toBe(300)
  })

  it('ドラッグ中に readOnly へ切り替えると、離しても幅が変わらない', async () => {
    const { editor, rerender } = await mount({})
    const handle = document.querySelector<HTMLElement>('[data-resize-handle]')!
    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
    rerender({ readOnly: true })
    await waitFor(() => expect(editor.isEditable).toBe(false))
    fireEvent.mouseMove(document, { clientX: -100, clientY: -100 })
    fireEvent.mouseUp(document)
    expect(imageWidth(editor)).toBe(300)
  })

  it('readOnly から編集可能へ戻すとドラッグで幅が書き換わる', async () => {
    const { editor, rerender } = await mount({ readOnly: true })
    rerender({ readOnly: false })
    await waitFor(() => expect(editor.isEditable).toBe(true))
    drag()
    expect(imageWidth(editor)).not.toBe(300)
  })
})

describe('最小サイズを下回る画像のリサイズ', () => {
  const setDisplaySize = (img: HTMLImageElement, width: number, height: number) => {
    // jsdom は寸法を持たないため、ドラッグの開始・確定時に読む表示サイズを与える
    Object.defineProperty(img, 'offsetWidth', { configurable: true, value: width })
    Object.defineProperty(img, 'offsetHeight', { configurable: true, value: height })
  }

  const mountImage = async (
    size: Record<string, unknown>,
    display: { width: number; height: number },
  ) => {
    const { result } = renderHook(() =>
      useRichTextEditor({
        features: ['image'],
        defaultValue: {
          type: 'doc',
          content: [{ type: 'image', attrs: { ...size, src: 'https://example.com/a.png' } }],
        },
      }),
    )
    await waitFor(() => expect(result.current.editor).not.toBeNull())
    render(<EditorContent editor={result.current.editor!} />)
    await waitFor(() => expect(document.querySelector('[data-resize-handle]')).not.toBeNull())

    const img = document.querySelector<HTMLImageElement>('.ProseMirror img')!
    setDisplaySize(img, display.width, display.height)

    return { editor: result.current.editor!, img }
  }

  // 1000×50 のように、縦横比を保つと最小の高さ（100px）を満たせない画像
  const mountWide = async () =>
    (await mountImage({ width: 1000, height: 50 }, { width: 1000, height: 50 })).img

  it('表示が狭くて縮んでいるだけの画像は、最小サイズを下回る大きさでは保存しない', async () => {
    const { editor, img } = await mountImage(
      { width: 800, height: 400 },
      { width: 180, height: 90 },
    )
    const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!

    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(document, { clientX: 10, clientY: 0 })
    setDisplaySize(img, 190, 95)
    fireEvent.mouseUp(document)

    expect(editor.$node('image')!.attributes).toMatchObject({ width: 200, height: 100 })
  })

  it('表示に使われない寸法（文字列）は、下限の基準にしない', async () => {
    // 文字列の寸法は表示に使われず、画像本来の 4:1 で表示される
    const { editor, img } = await mountImage(
      { width: '800', height: '400' },
      { width: 180, height: 45 },
    )
    Object.defineProperty(img, 'naturalWidth', { configurable: true, value: 2000 })
    Object.defineProperty(img, 'naturalHeight', { configurable: true, value: 500 })
    const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!

    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(document, { clientX: 10, clientY: 0 })
    setDisplaySize(img, 190, 48)
    fireEvent.mouseUp(document)

    expect(editor.$node('image')!.attributes).toMatchObject({ width: 400, height: 100 })
  })

  it('ドラッグを始めても最小サイズへ跳ねず、ポインターの移動ぶんだけ変わる', async () => {
    const img = await mountWide()
    const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!

    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
    try {
      fireEvent.mouseMove(document, { clientX: 10, clientY: 0 })

      expect(img.style.width).toBe('1010px')
    } finally {
      fireEvent.mouseUp(document)
    }
  })

  it('もともと下回っている辺は、それ以上縮めない', async () => {
    const img = await mountWide()
    const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!

    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
    try {
      fireEvent.mouseMove(document, { clientX: -500, clientY: 0 })

      expect(img.style.width).toBe('1000px')
      expect(img.style.height).toBe('50px')
    } finally {
      fireEvent.mouseUp(document)
    }
  })
})

describe('配置', () => {
  const mountWithAttrs = async (attrs: Record<string, unknown>) => {
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

    return result.current.editor!
  }

  const resizeContainer = () =>
    document.querySelector<HTMLElement>('.ProseMirror [data-resize-container]')!

  it('中央・右でリサイズ用の枠に余白が当たり、左で外れる', async () => {
    const editor = await mountWithAttrs({ align: 'center' })
    expect(resizeContainer().style.marginLeft).toBe('auto')
    expect(resizeContainer().style.marginRight).toBe('auto')

    editor.chain().setNodeSelection(0).updateAttributes('image', { align: 'right' }).run()
    await waitFor(() => expect(resizeContainer().style.marginRight).toBe(''))
    expect(resizeContainer().style.marginLeft).toBe('auto')

    editor.chain().setNodeSelection(0).updateAttributes('image', { align: null }).run()
    await waitFor(() => expect(resizeContainer().style.marginLeft).toBe(''))
  })

  it('alt やサイズを変えても配置が保たれ、img には寄せ方の style が付かない', async () => {
    const editor = await mountWithAttrs({ align: 'center', width: 200, height: 100 })

    editor
      .chain()
      .setNodeSelection(0)
      .updateAttributes('image', { alt: '説明', width: 150, height: 75 })
      .run()

    await waitFor(() => {
      const img = document.querySelector<HTMLImageElement>('.ProseMirror img')!
      expect(img.getAttribute('alt')).toBe('説明')
      expect(img.style.width).toBe('150px')
      expect(img.style.marginLeft).toBe('')
    })
    expect(resizeContainer().style.marginLeft).toBe('auto')
    expect(resizeContainer().style.marginRight).toBe('auto')
  })

  // jsdom は寸法を持たないので、ドラッグ開始時の幅は 0 になる
  it.each([
    [null, '200px'],
    ['center', '400px'],
  ])('右下のハンドルを右へ 200px 動かすと、配置 %s では幅が %s になる', async (align, width) => {
    await mountWithAttrs({ align })
    const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!
    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(document, { clientX: 200, clientY: 0 })

    expect(document.querySelector<HTMLImageElement>('.ProseMirror img')!.style.width).toBe(width)

    fireEvent.mouseUp(document)
  })
})
