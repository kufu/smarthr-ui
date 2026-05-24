'use client'

import { type FC, type RefObject, memo, useState } from 'react'

import { AddColumnButton } from './AddColumnButton'
import { AddRowButton } from './AddRowButton'
import { TableActionsButton } from './TableActionsButton'
import { useActiveTableRect } from './useActiveTableRect'
import { useHoveredTable } from './useHoveredTable'

import type { Editor } from '@tiptap/react'

type Props = {
  editor: Editor
  containerRef: RefObject<HTMLElement | null>
}

export const TableFloatingUI: FC<Props> = memo(({ editor, containerRef }) => {
  const activeInfo = useActiveTableRect(editor, containerRef)
  const { info: hoveredInfo, inRightBar, inBottomBar } = useHoveredTable(editor, containerRef)
  const [rightBarFocused, setRightBarFocused] = useState(false)
  const [bottomBarFocused, setBottomBarFocused] = useState(false)

  const buttonSize = 24
  const actionsGap = 4
  const barThickness = 24

  // 表示対象テーブル: caret 側 > ホバー側 の優先順位（caret あるなら caret の rect/pos を使う）
  const targetInfo = activeInfo ?? hoveredInfo
  if (!targetInfo) return null

  // ホバーは「hoveredInfo の pos === targetInfo.pos」のときだけ有効
  const hoverActive = hoveredInfo?.pos === targetInfo.pos
  const caretAtRight =
    !!activeInfo && activeInfo.pos === targetInfo.pos && activeInfo.isRightmostColumnSelected
  const caretAtBottom =
    !!activeInfo && activeInfo.pos === targetInfo.pos && activeInfo.isBottommostRowSelected

  const showRightBar = rightBarFocused || (hoverActive && inRightBar) || caretAtRight
  const showBottomBar = bottomBarFocused || (hoverActive && inBottomBar) || caretAtBottom

  const viewportRight = targetInfo.viewport.left + targetInfo.viewport.width
  const viewportBottom = targetInfo.viewport.top + targetInfo.viewport.height

  // 既存の viewport クランプロジック
  const colLeftIdeal = targetInfo.rect.left + targetInfo.rect.width
  const colLeftMax = viewportRight - barThickness
  const colLeft = Math.min(colLeftIdeal, colLeftMax)
  const colVisibleInViewport =
    colLeftMax >= targetInfo.viewport.left && targetInfo.rect.top + barThickness <= viewportBottom

  const rowTopIdeal = targetInfo.rect.top + targetInfo.rect.height
  const rowTopMax = viewportBottom - barThickness
  const rowTop = Math.min(rowTopIdeal, rowTopMax)
  const rowVisibleInViewport =
    rowTopMax >= targetInfo.viewport.top && targetInfo.rect.left + barThickness <= viewportRight

  return (
    <>
      {activeInfo &&
        (() => {
          const idealLeft = activeInfo.rect.left + activeInfo.rect.width - buttonSize
          const maxLeft = viewportRight - buttonSize - actionsGap
          const idealTop = activeInfo.rect.top - buttonSize - actionsGap
          const minTop = activeInfo.viewport.top
          return (
            <TableActionsButton
              editor={editor}
              top={Math.max(idealTop, minTop)}
              left={Math.min(idealLeft, Math.max(0, maxLeft))}
            />
          )
        })()}
      {showRightBar && colVisibleInViewport && (
        <AddColumnButton
          editor={editor}
          tablePos={targetInfo.pos}
          top={targetInfo.rect.top}
          left={colLeft}
          height={targetInfo.rect.height}
          thickness={barThickness}
          onFocus={() => setRightBarFocused(true)}
          onBlur={() => setRightBarFocused(false)}
        />
      )}
      {showBottomBar && rowVisibleInViewport && (
        <AddRowButton
          editor={editor}
          tablePos={targetInfo.pos}
          top={rowTop}
          left={targetInfo.rect.left}
          width={targetInfo.rect.width}
          thickness={barThickness}
          onFocus={() => setBottomBarFocused(true)}
          onBlur={() => setBottomBarFocused(false)}
        />
      )}
    </>
  )
})
