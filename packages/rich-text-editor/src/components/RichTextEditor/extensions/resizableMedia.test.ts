import { fireEvent } from '@testing-library/react'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { afterEach, describe, expect, it } from 'vitest'

import { CustomImage } from './Image/CustomImage'
import { configureExtensions } from './configureExtensions'

const MEDIA_DOC = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'image', attrs: { src: 'https://example.com/a.png' } }],
    },
    { type: 'youtube', attrs: { src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } },
  ],
}

const editors: Editor[] = []
afterEach(() => {
  while (editors.length > 0) editors.pop()?.destroy()
  document.body.innerHTML = ''
})

const countUpdateListeners = (editor: Editor) =>
  (editor as unknown as { callbacks: Record<string, unknown[] | undefined> }).callbacks.update
    ?.length ?? 0

describe('リサイズできるメディアの NodeView', () => {
  it('作り直しても editor の update の購読が増えない', () => {
    const editor = new Editor({
      element: document.createElement('div'),
      extensions: configureExtensions({ features: ['image', 'youtube'] }),
      content: MEDIA_DOC,
    })
    editors.push(editor)
    const before = countUpdateListeners(editor)

    // 同じ内容では NodeView が使い回されるため、いったん空にして作り直させる
    for (let i = 0; i < 5; i++) {
      editor.commands.setContent({ type: 'doc', content: [{ type: 'paragraph' }] })
      editor.commands.setContent(MEDIA_DOC)
    }

    expect(countUpdateListeners(editor)).toBe(before)
  })
})

describe('縦横比を保たない設定でのリサイズ', () => {
  it('表示が縮んでいても、ドラッグした大きさのまま確定する', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({
      element,
      extensions: [
        StarterKit,
        CustomImage.configure({
          isResizable: () => true,
          resize: {
            enabled: true,
            alwaysPreserveAspectRatio: false,
            minWidth: 100,
            minHeight: 100,
          },
        }),
      ],
      content: {
        type: 'doc',
        content: [
          { type: 'image', attrs: { src: 'https://example.com/a.png', width: 800, height: 400 } },
        ],
      },
    })
    editors.push(editor)
    const img = element.querySelector('img')!
    const setDisplaySize = (width: number, height: number) => {
      Object.defineProperty(img, 'offsetWidth', { configurable: true, value: width })
      Object.defineProperty(img, 'offsetHeight', { configurable: true, value: height })
    }
    setDisplaySize(180, 90)
    const handle = element.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]')!

    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(document, { clientX: 10, clientY: 0 })
    setDisplaySize(190, 90)
    fireEvent.mouseUp(document)

    expect(editor.$node('image')!.attributes).toMatchObject({ width: 190, height: 90 })
  })
})
