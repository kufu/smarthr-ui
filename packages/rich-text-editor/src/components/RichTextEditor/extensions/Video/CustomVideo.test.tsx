import { fireEvent, render, renderHook, waitFor } from '@testing-library/react'
import { EditorContent } from '@tiptap/react'
import { describe, expect, it, vi } from 'vitest'

import { useRichTextEditor } from '../../hooks/useRichTextEditor'

import type { RichTextFeature } from '../../types'
import type { Editor } from '@tiptap/react'

const SRC = 'https://example.com/a.mp4'

const mount = async (
  attrs: Record<string, unknown> = { width: 640, height: 360 },
  options: { features?: RichTextFeature[] } = {},
) => {
  const { result } = renderHook(() =>
    useRichTextEditor({
      features: options.features ?? ['video'],
      defaultValue: {
        type: 'doc',
        content: [{ type: 'video', attrs: { ...attrs, src: SRC } }],
      },
    }),
  )
  await waitFor(() => expect(result.current.editor).not.toBeNull())
  render(<EditorContent editor={result.current.editor!} />)
  await waitFor(() => expect(document.querySelector('.ProseMirror video')).not.toBeNull())

  return result.current.editor!
}

const container = () =>
  document.querySelector<HTMLElement>('.ProseMirror [data-resize-container][data-node="video"]')
const wrapper = () => document.querySelector<HTMLElement>('.ProseMirror div[data-video]')!
const video = () => document.querySelector<HTMLVideoElement>('.ProseMirror video')!
const attrsOf = (editor: Editor) => editor.$node('video')!.attributes

const loadMetadata = (width: number, height: number) => {
  Object.defineProperty(video(), 'videoWidth', { value: width, configurable: true })
  Object.defineProperty(video(), 'videoHeight', { value: height, configurable: true })
  fireEvent(video(), new Event('loadedmetadata'))
}

const dragRightBy = (dx: number, finalWidth: number) => {
  const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!
  fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
  fireEvent.mouseMove(document, { clientX: dx, clientY: 0 })
  // jsdom は寸法を持たないので、確定時に読まれる幅を与える
  Object.defineProperty(wrapper(), 'offsetWidth', { value: finalWidth, configurable: true })
  fireEvent.mouseUp(document)
}

describe('CustomVideo NodeView', () => {
  it('リサイズ用の枠に包まれ、保存された幅と縦横比で表示する', async () => {
    await mount()

    expect(container()).not.toBeNull()
    expect(wrapper().style.width).toBe('640px')
    expect(wrapper().style.height).toBe('')
    expect(video().style.width).toBe('100%')
    expect(video().style.aspectRatio).toBe('640 / 360')
  })

  it('ドラッグを確定すると、保存された縦横比のまま幅と高さを保存する', async () => {
    const editor = await mount({ width: 640, height: 360 })

    dragRightBy(-160, 480)

    expect(attrsOf(editor)).toMatchObject({ width: 480, height: 270 })
    expect(video().style.aspectRatio).toBe('480 / 270')
  })

  it('寸法が保存されていない動画は、読み込んだ動画の縦横比で表示し、その比率で保存する', async () => {
    const editor = await mount({})
    expect(video().style.aspectRatio).toBe('')

    loadMetadata(1280, 720)
    expect(video().style.aspectRatio).toBe('1280 / 720')

    dragRightBy(-880, 400)

    expect(attrsOf(editor)).toMatchObject({ width: 400, height: 225 })
  })

  it('動画の縦横比が分からないうちにドラッグを確定すると幅だけを保存し、読み込んだ動画の縦横比で表示する', async () => {
    const editor = await mount({})
    Object.defineProperty(wrapper(), 'offsetHeight', { value: 100, configurable: true })

    dragRightBy(-100, 200)

    expect(attrsOf(editor)).toMatchObject({ width: 200, height: null })
    expect(video().style.aspectRatio).toBe('')

    loadMetadata(1280, 720)

    expect(wrapper().style.width).toBe('200px')
    expect(video().style.aspectRatio).toBe('1280 / 720')
  })

  it('ドラッグ中だけ、動画プレーヤーがポインタを受け取らない', async () => {
    await mount()
    const handle = document.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!

    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
    expect(video().style.pointerEvents).toBe('none')

    fireEvent.mouseUp(document)
    expect(video().style.pointerEvents).toBe('')
  })

  it('配置や大きさを変えても video を作り直さず、src を設定し直さない', async () => {
    const editor = await mount()
    const before = video()
    const setAttribute = vi.spyOn(before, 'setAttribute')

    editor
      .chain()
      .setNodeSelection(0)
      .updateAttributes('video', { align: 'center', width: 480, height: 270 })
      .run()

    await waitFor(() => expect(container()!.style.marginLeft).toBe('auto'))
    expect(video()).toBe(before)
    expect(setAttribute).not.toHaveBeenCalledWith('src', expect.anything())
    expect(wrapper().style.width).toBe('480px')
    expect(wrapper().getAttribute('style') ?? '').not.toContain('margin')
  })

  it('src が変わると同じ video の src だけを差し替える', async () => {
    const editor = await mount()
    const before = video()

    editor.chain().setNodeSelection(0).updateAttributes('video', { src: '/b.mp4' }).run()

    await waitFor(() => expect(video().getAttribute('src')).toBe('/b.mp4'))
    expect(video()).toBe(before)
  })

  it('属性の同期で、編集中に付けた tabindex を外さない', async () => {
    const editor = await mount()
    expect(video()).toHaveAttribute('tabindex', '-1')

    editor.chain().setNodeSelection(0).updateAttributes('video', { align: 'right' }).run()

    await waitFor(() => expect(container()!.style.marginLeft).toBe('auto'))
    expect(video()).toHaveAttribute('tabindex', '-1')
  })

  it('features に video が無ければリサイズ用の枠を作らない', async () => {
    await mount(undefined, { features: ['image'] })

    expect(container()).toBeNull()
    expect(document.querySelector('[data-resize-handle]')).toBeNull()
  })
})
