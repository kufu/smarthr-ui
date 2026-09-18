'use client'

import { type FC, type RefObject, memo, useState } from 'react'

import { AddTableAxisButton } from './AddTableAxisButton'
import { TableCellControls } from './TableCellControls'
import { TABLE_BAR_GAP, TABLE_BAR_THICKNESS } from './tableGeometry'
import { useActiveTableRect } from './useActiveTableRect'
import { useHoveredTable } from './useHoveredTable'

import type { RichTextFeature } from '../../types'
import type { Editor } from '@tiptap/react'

type Props = {
  features: readonly RichTextFeature[]
  editor: Editor
  containerRef: RefObject<HTMLElement | null>
}

export const TableFloatingUI: FC<Props> = memo(({ editor, containerRef, features }) => {
  const activeInfo = useActiveTableRect(editor, containerRef)
  const { info: hoveredInfo, inRightBar, inBottomBar } = useHoveredTable(editor, containerRef)
  const [rightBarFocused, setRightBarFocused] = useState(false)
  const [bottomBarFocused, setBottomBarFocused] = useState(false)

  // ポインター操作中はホバー先の表、キーボード操作中は選択中の表を対象にする。
  const targetInfo = hoveredInfo ?? activeInfo
  if (!targetInfo)
    return <TableCellControls containerRef={containerRef} features={features} editor={editor} />

  // ホバーは「hoveredInfo の pos === targetInfo.pos」のときだけ有効
  const hoverActive = hoveredInfo?.pos === targetInfo.pos
  const activeMatches = activeInfo?.pos === targetInfo.pos
  const showRightBar =
    rightBarFocused ||
    (hoverActive && inRightBar) ||
    (activeMatches && activeInfo?.isRightmostColumnSelected)
  const showBottomBar =
    bottomBarFocused ||
    (hoverActive && inBottomBar) ||
    (activeMatches && activeInfo?.isBottommostRowSelected)

  const viewportRight = targetInfo.viewport.left + targetInfo.viewport.width
  const viewportBottom = targetInfo.viewport.top + targetInfo.viewport.height

  // 既存の viewport クランプロジック
  const barGap = TABLE_BAR_GAP
  const colLeftIdeal = targetInfo.rect.left + targetInfo.rect.width + barGap
  const barThickness = TABLE_BAR_THICKNESS
  const colLeftMax = viewportRight - barThickness
  const colLeft = Math.min(colLeftIdeal, colLeftMax)
  const colTop = Math.max(targetInfo.rect.top, targetInfo.viewport.top)
  const colHeight = Math.min(targetInfo.rect.top + targetInfo.rect.height, viewportBottom) - colTop
  const colVisibleInViewport =
    colHeight > 0 &&
    colLeftMax >= targetInfo.viewport.left &&
    targetInfo.rect.top + barThickness <= viewportBottom

  const rowTopIdeal = targetInfo.rect.top + targetInfo.rect.height + barGap
  const rowTopMax = viewportBottom - barThickness
  const rowTop = Math.min(rowTopIdeal, rowTopMax)
  const rowVisibleInViewport =
    rowTopMax >= targetInfo.viewport.top && targetInfo.rect.left + barThickness <= viewportRight

  return (
    <>
      <TableCellControls containerRef={containerRef} features={features} editor={editor} />
      {showRightBar && colVisibleInViewport && (
        <AddTableAxisButton
          axis="column"
          editor={editor}
          tablePos={targetInfo.pos}
          top={colTop}
          left={colLeft}
          thickness={barThickness}
          length={colHeight}
          onFocus={() => setRightBarFocused(true)}
          onBlur={() => setRightBarFocused(false)}
        />
      )}
      {showBottomBar && rowVisibleInViewport && (
        <AddTableAxisButton
          axis="row"
          editor={editor}
          tablePos={targetInfo.pos}
          top={rowTop}
          left={targetInfo.rect.left}
          thickness={barThickness}
          length={targetInfo.rect.width}
          onFocus={() => setBottomBarFocused(true)}
          onBlur={() => setBottomBarFocused(false)}
        />
      )}
    </>
  )
})
