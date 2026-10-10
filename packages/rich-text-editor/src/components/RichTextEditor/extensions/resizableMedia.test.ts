import { Editor } from '@tiptap/core'
import { afterEach, describe, expect, it } from 'vitest'

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
