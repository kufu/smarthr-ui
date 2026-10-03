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

const isSameRect = (a: RelativeRect, b: RelativeRect) =>
  a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height

// useEffect で測ると、対象が切り替わった直後の1フレームだけ操作UIが前の位置に出る
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

      const next = {
        pos,
        rect: getRelativeRect(el.getBoundingClientRect(), origin),
        viewport: getRelativeRect(editor.view.dom.getBoundingClientRect(), origin),
      }

      setNodeRect((prev) =>
        prev?.pos === next.pos &&
        isSameRect(prev.rect, next.rect) &&
        isSameRect(prev.viewport, next.viewport)
          ? prev
          : next,
      )
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

  // pos が変わった描画で null を返すと、利用側が操作UIごとアンマウントして開いているポップオーバーの入力を失う。
  // 測り直しは描画前に終わるので、前の矩形が画面に出ることはない
  return pos === null ? null : nodeRect
}
