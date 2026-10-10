'use client'

import { type FC, type ReactNode, type RefObject, useCallback, useMemo, useState } from 'react'

import { tv } from '../../../libs/tv'
import { useNodeRect } from '../hooks/useNodeRect'

import type { Editor } from '@tiptap/react'

const classNameGenerator = tv({
  base: [
    // 右端付近では絶対配置の残り幅に押し込まれて文字が折り返すため、中身の幅を保つ
    'shr-rte-absolute shr-rte-z-0 shr-rte-w-max',
    'shr-rte-inline-flex shr-rte-items-center shr-rte-gap-0.25',
    'shr-rte-border-shorthand shr-rte-rounded-m shr-rte-bg-white shr-rte-p-0.25 shr-rte-shadow-layer-2',
  ],
})

type Props = {
  editor: Editor
  nodeName: 'image' | 'youtube'
  containerRef: RefObject<HTMLElement | null>
  pos: number
  resolveElement: (dom: Node | null) => HTMLElement | null
  label: string
  className: string
  children: ReactNode
}

const BAR_GAP = 6
const BAR_HEIGHT = 36

export const NodeFloatingToolbar: FC<Props> = ({
  editor,
  nodeName,
  containerRef,
  pos,
  resolveElement,
  label,
  className,
  children,
}) => {
  const info = useNodeRect(editor, containerRef, pos, resolveElement)
  const barClassName = useMemo(() => classNameGenerator({ className }), [className])
  const [barWidth, setBarWidth] = useState(0)

  const barRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return

      // ref の時点で測れば、はみ出した位置のまま描かれる瞬間が無い
      setBarWidth(node.offsetWidth)

      const observer = new ResizeObserver(() => setBarWidth(node.offsetWidth))
      observer.observe(node)

      const handlers = editor.storage.mediaToolbarShortcut?.focusToolbar
      // 先頭ではなく、矢印キーで最後に選んでいたボタン（tabindex=0）へ戻す
      const focusToolbar = () => node.querySelector<HTMLElement>('[tabindex="0"]')?.focus()

      if (handlers) handlers[nodeName] = focusToolbar

      return () => {
        observer.disconnect()

        if (handlers?.[nodeName] === focusToolbar) delete handlers[nodeName]
      }
    },
    [editor, nodeName],
  )

  if (!info) return null

  const idealTop = info.rect.top - BAR_HEIGHT - BAR_GAP
  const top = Math.max(idealTop, info.viewport.top)
  const maxLeft = info.viewport.left + info.viewport.width - barWidth
  const left = Math.max(info.viewport.left, Math.min(info.rect.left, maxLeft))

  return (
    <div
      ref={barRef}
      role="toolbar"
      className={barClassName}
      style={{ top, left }}
      aria-label={label}
    >
      {children}
    </div>
  )
}
