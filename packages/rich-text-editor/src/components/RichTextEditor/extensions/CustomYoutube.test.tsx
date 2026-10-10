import { fireEvent, render, renderHook, waitFor } from '@testing-library/react'
import { EditorContent } from '@tiptap/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { useRichTextEditor } from '../hooks/useRichTextEditor'

import type { RichTextFeature } from '../types'
import type { Editor } from '@tiptap/react'

// jsdom には ResizeObserver が無く、エディタがマウント時に参照する
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
  }
})

const SRC = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

const mount = async (
  attrs: Record<string, unknown> = { width: 320, height: 180 },
  options: { features?: RichTextFeature[]; readOnly?: boolean } = {},
) => {
  const { result } = renderHook(() =>
    useRichTextEditor({
      readOnly: options.readOnly,
      features: options.features ?? ['youtube'],
      defaultValue: {
        type: 'doc',
        content: [{ type: 'youtube', attrs: { ...attrs, src: SRC } }],
      },
    }),
  )
  await waitFor(() => expect(result.current.editor).not.toBeNull())
  render(<EditorContent editor={result.current.editor!} />)
  await waitFor(() => expect(document.querySelector('.ProseMirror iframe')).not.toBeNull())

  return result.current.editor!
}

const container = () =>
  document.querySelector<HTMLElement>('.ProseMirror [data-resize-container][data-node="youtube"]')
const video = () => document.querySelector<HTMLElement>('.ProseMirror div[data-youtube-video]')!
const iframe = () => document.querySelector<HTMLIFrameElement>('.ProseMirror iframe')!
const attrsOf = (editor: Editor) => editor.$node('youtube')!.attributes

const dragRightBy = (dx: number, finalWidth?: number) => {
  const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!
  fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
  fireEvent.mouseMove(document, { clientX: dx, clientY: 0 })
  // jsdom は寸法を持たないので、確定時に読まれる幅を与える
  if (finalWidth !== undefined) {
    Object.defineProperty(video(), 'offsetWidth', { value: finalWidth, configurable: true })
  }
  fireEvent.mouseUp(document)
}

describe('CustomYoutube NodeView', () => {
  it('リサイズ用の枠に包まれ、動画は保存された幅で、iframe は縦横比を保つ', async () => {
    await mount()
    expect(container()).not.toBeNull()
    expect(video().style.width).toBe('320px')
    expect(video().style.height).toBe('')
    expect(video().getAttribute('style') ?? '').not.toContain('margin')
    expect(iframe().style.width).toBe('100%')
    expect(iframe().style.aspectRatio).toBe('320 / 180')
  })

  it('640×480 の既存データは開いただけでは書き換えず、その比率で表示する', async () => {
    const editor = await mount({ width: 640, height: 480 })
    expect(attrsOf(editor)).toMatchObject({ width: 640, height: 480 })
    expect(iframe().style.aspectRatio).toBe('640 / 480')
  })

  it.each([
    [null, 200, '356px'],
    ['center', 200, '400px'],
  ])('配置 %s で右下のハンドルを右へ %dpx 動かすと幅が %s になる', async (align, dx, width) => {
    await mount({ width: 320, height: 180, align })
    const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!
    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(document, { clientX: dx, clientY: 0 })

    expect(video().style.width).toBe(width)
    expect(video().style.height).toBe('')

    fireEvent.mouseUp(document)
  })

  it('ドラッグを確定すると幅と 16:9 の高さを保存する', async () => {
    const editor = await mount({ width: 640, height: 480 })
    dragRightBy(480, 480)
    expect(attrsOf(editor)).toMatchObject({ width: 480, height: 270 })
    expect(iframe().style.aspectRatio).toBe('480 / 270')
  })

  it('ドラッグ中だけ、動画プレーヤーがポインタを受け取らない', async () => {
    await mount()
    const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!
    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
    expect(iframe().style.pointerEvents).toBe('none')

    fireEvent.mouseUp(document)
    expect(iframe().style.pointerEvents).toBe('')
  })

  it('確定時の幅が最小幅を下回っても、356×200 で保存する', async () => {
    const editor = await mount()
    dragRightBy(10)
    expect(attrsOf(editor)).toMatchObject({ width: 356, height: 200 })
  })

  it('タッチでドラッグして離すと確定し、ドラッグ中の状態が解ける', async () => {
    const editor = await mount()
    const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!
    fireEvent.touchStart(handle, { touches: [{ clientX: 0, clientY: 0 }] })
    fireEvent.touchMove(document, { touches: [{ clientX: 200, clientY: 0 }] })
    expect(container()!.dataset.resizeState).toBe('true')

    fireEvent.touchEnd(document, { changedTouches: [{ clientX: 200, clientY: 0 }] })

    expect(container()!.dataset.resizeState).toBe('false')
    expect(attrsOf(editor)).toMatchObject({ width: 356, height: 200 })
  })

  it('移動量が 0 の mousemove を挟んで離しても寸法を書き換えない', async () => {
    const editor = await mount({ width: 640, height: 480 })
    const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!
    Object.defineProperty(video(), 'offsetWidth', { value: 374, configurable: true })
    fireEvent.mouseDown(handle, { clientX: 10, clientY: 10 })
    fireEvent.mouseMove(document, { clientX: 10, clientY: 10 })
    fireEvent.mouseUp(document)

    expect(attrsOf(editor)).toMatchObject({ width: 640, height: 480 })
  })

  it('タッチでドラッグ中に動画が消えたら、タッチの購読を外す', async () => {
    const editor = await mount()
    const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!
    fireEvent.touchStart(handle, { touches: [{ clientX: 0, clientY: 0 }] })
    const removeEventListener = vi.spyOn(document, 'removeEventListener')

    editor.commands.clearContent()

    await waitFor(() => expect(container()).toBeNull())
    expect(removeEventListener).toHaveBeenCalledWith('touchend', expect.any(Function))
    expect(removeEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function))
  })

  it('ハンドルを動かさずに離しただけでは寸法を書き換えない', async () => {
    const editor = await mount({ width: 640, height: 480 })
    const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!
    // 狭いエディタで縮んで表示されている状態
    Object.defineProperty(video(), 'offsetWidth', { value: 374, configurable: true })
    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
    fireEvent.mouseUp(document)

    expect(attrsOf(editor)).toMatchObject({ width: 640, height: 480 })
    expect(video().style.width).toBe('640px')
    expect(iframe().style.aspectRatio).toBe('640 / 480')
  })

  it('readOnly ではドラッグしてもサイズが変わらない', async () => {
    const editor = await mount(undefined, { readOnly: true })
    dragRightBy(480, 480)
    expect(attrsOf(editor)).toMatchObject({ width: 320, height: 180 })
  })

  it('属性を変えても iframe を作り直さず、src が同じなら src を設定し直さない', async () => {
    const editor = await mount()
    const before = iframe()
    const setAttribute = vi.spyOn(before, 'setAttribute')

    editor
      .chain()
      .setNodeSelection(0)
      .updateAttributes('youtube', { align: 'center', width: 480, height: 270 })
      .run()

    await waitFor(() => expect(container()!.style.marginLeft).toBe('auto'))
    expect(iframe()).toBe(before)
    expect(setAttribute).not.toHaveBeenCalledWith('src', expect.anything())
    expect(video().style.width).toBe('480px')
  })

  it('src が変わると同じ iframe の src だけを差し替える', async () => {
    const editor = await mount()
    const before = iframe()

    editor
      .chain()
      .setNodeSelection(0)
      .updateAttributes('youtube', { src: 'https://www.youtube.com/watch?v=ZFwv6s7kXCQ' })
      .run()

    await waitFor(() => expect(iframe().getAttribute('src')).toContain('ZFwv6s7kXCQ'))
    expect(iframe()).toBe(before)
  })

  it('編集中は最初の表示から動画プレーヤーを Tab の移動先から外す', async () => {
    await mount()
    expect(iframe()).toHaveAttribute('tabindex', '-1')
  })

  it('属性の同期で、編集中に付けた tabindex を外さない', async () => {
    const editor = await mount()
    const removeAttribute = vi.spyOn(iframe(), 'removeAttribute')

    editor.chain().setNodeSelection(0).updateAttributes('youtube', { align: 'right' }).run()

    await waitFor(() => expect(container()!.style.marginLeft).toBe('auto'))
    expect(removeAttribute).not.toHaveBeenCalledWith('tabindex')
  })

  it('配置は枠の余白で表し、左に戻すと外れる', async () => {
    const editor = await mount({ width: 320, height: 180, align: 'center' })
    expect(container()!.style.marginLeft).toBe('auto')
    expect(container()!.style.marginRight).toBe('auto')

    editor.chain().setNodeSelection(0).updateAttributes('youtube', { align: null }).run()
    await waitFor(() => expect(container()!.style.marginLeft).toBe(''))
    expect(container()!.style.marginRight).toBe('')
  })

  it('features に youtube が無ければリサイズ用の枠を作らない', async () => {
    await mount(undefined, { features: ['image'] })
    expect(container()).toBeNull()
    expect(document.querySelector('[data-resize-handle]')).toBeNull()
  })
})
