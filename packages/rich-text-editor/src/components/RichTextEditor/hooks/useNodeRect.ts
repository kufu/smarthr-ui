'use client'

import { type RefObject, useLayoutEffect, useState } from 'react'

import { useLatest } from '../../../hooks/useLatest'
import {
  type RelativeRect,
  getControlOrigin,
  getRelativeRect,
} from '../extensions/floatingGeometry'

import type { Editor } from '@tiptap/react'

export type NodeRect = {
  pos: number
  rect: RelativeRect
  /** 編集領域の矩形。操作UIのはみ出しを抑える基準にする */
  viewport: RelativeRect
}

// useEffect で測ると、対象が切り替わるたびに操作UIが1フレーム消える
export const useNodeRect = (
  editor: Editor,
  containerRef: RefObject<HTMLElement | null>,
  pos: number | null,
  resolveElement: (dom: Node | null) => HTMLElement | null,
): NodeRect | null => {
  const [nodeRect, setNodeRect] = useState<NodeRect | null>(null)
  const latest = useLatest({ containerRef, resolveElement })

  useLayoutEffect(() => {
    if (pos === null) {
      setNodeRect(null)

      return
    }

    const measure = () => {
      const el = latest.resolveElement(editor.view.nodeDOM(pos))
      const container = latest.containerRef.current

      if (!el || !container) {
        setNodeRect(null)

        return
      }

      const origin = getControlOrigin(container)

      setNodeRect({
        pos,
        rect: getRelativeRect(el.getBoundingClientRect(), origin),
        viewport: getRelativeRect(editor.view.dom.getBoundingClientRect(), origin),
      })
    }

    measure()

    // 前にある内容の編集で位置だけが動いても、ResizeObserver は発火しない
    let updateFrame: number | null = null
    const handleUpdate = () => {
      if (updateFrame !== null) cancelAnimationFrame(updateFrame)

      updateFrame = requestAnimationFrame(() => {
        updateFrame = null
        measure()
      })
    }

    const observed = latest.resolveElement(editor.view.nodeDOM(pos))
    const resizeObserver = new ResizeObserver(measure)

    if (observed) resizeObserver.observe(observed)
    if (latest.containerRef.current) resizeObserver.observe(latest.containerRef.current)
    // コンテナの高さが固定だと、前にある内容が伸びて対象が動いてもコンテナは発火しない
    resizeObserver.observe(editor.view.dom, { box: 'border-box' })

    editor.on('update', handleUpdate)
    // スクロールは位置の変化なので ResizeObserver で検知できない。capture phase で祖先全部のスクロールを拾う。
    window.addEventListener('scroll', measure, true)

    return () => {
      resizeObserver.disconnect()
      editor.off('update', handleUpdate)

      if (updateFrame !== null) cancelAnimationFrame(updateFrame)

      window.removeEventListener('scroll', measure, true)
    }
  }, [editor, pos, latest])

  return nodeRect?.pos === pos ? nodeRect : null
}
