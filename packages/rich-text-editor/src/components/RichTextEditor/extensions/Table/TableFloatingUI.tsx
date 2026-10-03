'use client'

import { CellSelection, TableMap } from '@tiptap/pm/tables'
import { useEditorState } from '@tiptap/react'
import { type FC, type RefObject, memo, useEffect, useState } from 'react'

import { useLatest } from '../../../../hooks/useLatest'
import { useNodeRect } from '../../hooks/useNodeRect'
import { getControlOrigin, getRelativeRect } from '../floatingGeometry'

import { AddTableAxisButton } from './AddTableAxisButton'
import { TableCellControls } from './TableCellControls'
import { detectEdgeCells } from './helpers/edgeCellDetection'
import { hitTestExtendedTableArea } from './helpers/extendedHitArea'
import {
  TABLE_BAR_GAP,
  TABLE_BAR_THICKNESS,
  resolveTableDisplayElement,
  resolveTableDisplayElementFromDOM,
} from './tableGeometry'

import type { RichTextFeature } from '../../types'
import type { Editor } from '@tiptap/react'

const findTablePos = (editor: Editor): number | null => {
  const { $from } = editor.state.selection
  for (let depth = $from.depth; depth > 0; depth--) {
    if ($from.node(depth).type.name === 'table') {
      return $from.before(depth)
    }
  }
  return null
}

const computeEdgeCells = (
  editor: Editor,
  tablePos: number,
): { isRightmostColumnSelected: boolean; isBottommostRowSelected: boolean } => {
  const tableNode = editor.state.doc.nodeAt(tablePos)
  if (!tableNode || tableNode.type.name !== 'table') {
    return { isRightmostColumnSelected: false, isBottommostRowSelected: false }
  }
  const map = TableMap.get(tableNode)
  const tableStart = tablePos + 1
  const selection = editor.state.selection

  let cellOffsets: number[] = []
  if (selection instanceof CellSelection) {
    selection.forEachCell((_cellNode, cellPos) => {
      cellOffsets.push(cellPos - tableStart)
    })
  } else {
    const { $from } = selection
    for (let d = $from.depth; d > 0; d--) {
      const typeName = $from.node(d).type.name
      if (typeName === 'tableCell' || typeName === 'tableHeader') {
        cellOffsets = [$from.before(d) - tableStart]
        break
      }
    }
  }
  return detectEdgeCells(map, cellOffsets)
}

const BAR_THICKNESS = TABLE_BAR_GAP + TABLE_BAR_THICKNESS

const resolveTablePos = (editor: Editor, tableEl: HTMLElement): number | null => {
  try {
    const pos = editor.view.posAtDOM(tableEl, 0)
    const $pos = editor.state.doc.resolve(pos)
    for (let d = $pos.depth; d > 0; d--) {
      if ($pos.node(d).type.name === 'table') {
        return $pos.before(d)
      }
    }
  } catch {
    return null
  }
  return null
}

const measureTable = (
  editor: Editor,
  tableEl: HTMLElement,
  origin: { left: number; top: number },
) => {
  const pos = resolveTablePos(editor, tableEl)

  if (pos === null) return null

  return {
    pos,
    rect: getRelativeRect(resolveTableDisplayElement(tableEl).getBoundingClientRect(), origin),
  }
}

type Props = {
  features: readonly RichTextFeature[]
  editor: Editor
  containerRef: RefObject<HTMLElement | null>
}

export const TableFloatingUI: FC<Props> = memo(({ editor, containerRef, features }) => {
  const activeSelection = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e.isActive('table')) return null
      const tablePos = findTablePos(e)
      if (tablePos === null) return null
      const edge = computeEdgeCells(e, tablePos)
      return { tablePos, edge }
    },
    equalityFn: (a, b) =>
      a === b ||
      (!!a &&
        !!b &&
        a.tablePos === b.tablePos &&
        a.edge.isRightmostColumnSelected === b.edge.isRightmostColumnSelected &&
        a.edge.isBottommostRowSelected === b.edge.isBottommostRowSelected),
  })
  const tablePos = activeSelection?.tablePos ?? null
  const activeInfo = useNodeRect(editor, containerRef, tablePos, resolveTableDisplayElementFromDOM)

  const [hoveredPos, setHoveredPos] = useState<number | null>(null)
  const [inRightBar, setInRightBar] = useState(false)
  const [inBottomBar, setInBottomBar] = useState(false)
  const latest = useLatest({ containerRef })

  useEffect(() => {
    const container = latest.containerRef.current
    if (!container) return

    const clearAll = () => {
      setHoveredPos(null)
      setInRightBar(false)
      setInBottomBar(false)
    }

    const evaluate = (mouseEvent: MouseEvent) => {
      const origin = getControlOrigin(container)
      const point = { x: mouseEvent.clientX - origin.left, y: mouseEvent.clientY - origin.top }
      const targetEl = mouseEvent.target as HTMLElement | null
      const tableElFromTarget = targetEl?.closest('table') as HTMLElement | null
      // 表の外から直接バー領域に入った場合も、フォーカスなしで操作できる。
      const candidates = tableElFromTarget
        ? [tableElFromTarget]
        : Array.from(editor.view.dom.querySelectorAll<HTMLElement>('table'))

      for (const tableEl of candidates) {
        const measured = measureTable(editor, tableEl, origin)
        if (!measured) continue
        const hit = hitTestExtendedTableArea(point, measured.rect, BAR_THICKNESS)
        if (hit.inside) {
          setHoveredPos(measured.pos)
          setInRightBar(hit.inRightBar)
          setInBottomBar(hit.inBottomBar)
          return
        }
      }
      clearAll()
    }

    let frame: number | null = null
    let lastEvent: MouseEvent | null = null

    const handleMouseMove = (e: MouseEvent) => {
      lastEvent = e
      if (frame === null) {
        frame = window.requestAnimationFrame(() => {
          frame = null
          if (lastEvent) evaluate(lastEvent)
        })
      }
    }

    const handleMouseLeave = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame)
        frame = null
      }
      clearAll()
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [editor, latest])

  const hoveredInfo = useNodeRect(
    editor,
    containerRef,
    hoveredPos,
    resolveTableDisplayElementFromDOM,
  )

  const [rightBarFocused, setRightBarFocused] = useState(false)
  const [bottomBarFocused, setBottomBarFocused] = useState(false)

  // ポインター操作中はホバー先の表、キーボード操作中は選択中の表を対象にする。
  const targetInfo = hoveredInfo ?? activeInfo
  if (!targetInfo)
    return <TableCellControls containerRef={containerRef} features={features} editor={editor} />

  // ホバーは「hoveredInfo の pos === targetInfo.pos」のときだけ有効
  const hoverActive = hoveredInfo?.pos === targetInfo.pos
  const activeMatches = activeInfo?.pos === targetInfo.pos
  const isRightmostColumnSelected = activeSelection?.edge.isRightmostColumnSelected ?? false
  const isBottommostRowSelected = activeSelection?.edge.isBottommostRowSelected ?? false
  const showRightBar =
    rightBarFocused || (hoverActive && inRightBar) || (activeMatches && isRightmostColumnSelected)
  const showBottomBar =
    bottomBarFocused || (hoverActive && inBottomBar) || (activeMatches && isBottommostRowSelected)

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
