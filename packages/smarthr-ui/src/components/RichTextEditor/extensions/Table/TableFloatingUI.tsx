'use client'

import { type FC, Fragment, type RefObject, memo } from 'react'

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
  const { info: hoveredInfo, cancelClear, scheduleClear } = useHoveredTable(editor, containerRef)

  const buttonSize = 24
  // 「…」操作ボタンはテーブル上端の外側にgap分浮かせる
  const actionsGap = 4
  // +列/+行 バーはテーブルに密着（gap があるとそこにマウスが入った時に mouseout で消えるため）
  const barGap = 0
  const barThickness = 24

  return (
    <>
      {activeInfo &&
        (() => {
          // 「…」ボタンは ProseMirror viewport 内にクランプ（上下左右とも）
          const viewportRight = activeInfo.viewport.left + activeInfo.viewport.width
          const idealLeft = activeInfo.rect.left + activeInfo.rect.width - buttonSize
          const maxLeft = viewportRight - buttonSize - actionsGap
          // テーブルが ProseMirror 上端付近にあるとき、ボタンが viewport 外へ出ないよう min をクランプ
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
      {hoveredInfo &&
        (() => {
          // ProseMirror viewport の境界
          const viewportRight = hoveredInfo.viewport.left + hoveredInfo.viewport.width
          const viewportBottom = hoveredInfo.viewport.top + hoveredInfo.viewport.height

          // 理想位置と、viewport内に収めるための最大位置
          const colLeftIdeal = hoveredInfo.rect.left + hoveredInfo.rect.width + barGap
          const colLeftMax = viewportRight - barThickness - barGap
          const colLeft = Math.min(colLeftIdeal, colLeftMax)
          // viewportに少しでも入らないなら非表示
          const colVisible =
            colLeftMax >= hoveredInfo.viewport.left &&
            hoveredInfo.rect.top + barThickness <= viewportBottom

          const rowTopIdeal = hoveredInfo.rect.top + hoveredInfo.rect.height + barGap
          const rowTopMax = viewportBottom - barThickness - barGap
          const rowTop = Math.min(rowTopIdeal, rowTopMax)
          const rowVisible =
            rowTopMax >= hoveredInfo.viewport.top &&
            hoveredInfo.rect.left + barThickness <= viewportRight

          return (
            <Fragment key={hoveredInfo.pos}>
              {colVisible && (
                <AddColumnButton
                  editor={editor}
                  tablePos={hoveredInfo.pos}
                  top={hoveredInfo.rect.top}
                  left={colLeft}
                  height={hoveredInfo.rect.height}
                  thickness={barThickness}
                  onMouseEnter={cancelClear}
                  onMouseLeave={scheduleClear}
                />
              )}
              {rowVisible && (
                <AddRowButton
                  editor={editor}
                  tablePos={hoveredInfo.pos}
                  top={rowTop}
                  left={hoveredInfo.rect.left}
                  width={hoveredInfo.rect.width}
                  thickness={barThickness}
                  onMouseEnter={cancelClear}
                  onMouseLeave={scheduleClear}
                />
              )}
            </Fragment>
          )
        })()}
    </>
  )
})
