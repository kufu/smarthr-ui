'use client'

import { type Editor, useEditorState } from '@tiptap/react'
import { type RefObject, useEffect, useState } from 'react'

export type ActiveImageInfo = {
  pos: number
  /** container 相対の画像矩形 */
  rect: { top: number; left: number; width: number; height: number }
  /** ProseMirror 編集領域の container 相対矩形（クランプ基準） */
  viewport: { top: number; left: number; width: number; height: number }
}

const findSelectedImagePos = (editor: Editor): number | null => {
  const { state } = editor
  const { from } = state.selection
  const node = state.doc.nodeAt(from)
  if (node && node.type.name === 'image') return from
  return null
}

const resolveImageEl = (rootEl: HTMLElement | null): HTMLElement | null => {
  if (!rootEl) return null
  if (rootEl.tagName === 'IMG') return rootEl
  return (rootEl.querySelector('img') as HTMLElement | null) ?? rootEl
}

export const useActiveImageRect = (
  editor: Editor,
  containerRef: RefObject<HTMLElement | null>,
): ActiveImageInfo | null => {
  const pos = useEditorState({
    editor,
    selector: ({ editor: e }) => (e.isActive('image') ? findSelectedImagePos(e) : null),
  })

  const [info, setInfo] = useState<ActiveImageInfo | null>(null)

  useEffect(() => {
    if (pos === null) {
      setInfo(null)
      return
    }

    const updateRect = () => {
      const imgEl = resolveImageEl(editor.view.nodeDOM(pos) as HTMLElement | null)
      const containerEl = containerRef.current
      if (!imgEl || !containerEl) return
      const imgRect = imgEl.getBoundingClientRect()
      const containerRect = containerEl.getBoundingClientRect()
      const proseMirrorRect = editor.view.dom.getBoundingClientRect()
      setInfo({
        pos,
        rect: {
          top: imgRect.top - containerRect.top,
          left: imgRect.left - containerRect.left,
          width: imgRect.width,
          height: imgRect.height,
        },
        viewport: {
          top: proseMirrorRect.top - containerRect.top,
          left: proseMirrorRect.left - containerRect.left,
          width: proseMirrorRect.width,
          height: proseMirrorRect.height,
        },
      })
    }

    updateRect()

    const observed = resolveImageEl(editor.view.nodeDOM(pos) as HTMLElement | null)
    const resizeObserver = new ResizeObserver(updateRect)
    if (observed) resizeObserver.observe(observed)
    if (containerRef.current) resizeObserver.observe(containerRef.current)
    // スクロールは位置の変化なので ResizeObserver で検知できない。capture phase で祖先全部のスクロールを拾う。
    window.addEventListener('scroll', updateRect, true)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [editor, pos, containerRef])

  return info
}
