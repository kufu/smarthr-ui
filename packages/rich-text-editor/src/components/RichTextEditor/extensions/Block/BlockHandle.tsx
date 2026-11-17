'use client'

import {
  type DragEvent,
  type FC,
  type MouseEvent,
  type RefObject,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FaGripVerticalIcon } from 'smarthr-ui'

import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'
import { getControlOrigin } from '../floatingGeometry'

import { BLOCK_DRAG_TYPE, getBlockRects } from './BlockActions'
import { blockRangeAt, findBlockIndex } from './blockRange'

import type { Transaction } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/react'

const BLOCK_DRAGGING_ATTRIBUTE = 'data-block-dragging'

const CLASS_NAMES = {
  // 本文の左の余白（pl-2.5 = 40px）に置き、右端を本文の 8px 左に揃える。
  // 表の行ハンドルは本文の 2px 左から始まり、重ならない
  wrapper:
    'shr-rte-absolute shr-rte-left-0 shr-rte-z-1 shr-rte-flex shr-rte-w-[32px] shr-rte-items-center shr-rte-justify-end',
  grip: 'shr-rte-box-border shr-rte-flex shr-rte-h-[24px] shr-rte-w-[24px] shr-rte-cursor-grab shr-rte-items-center shr-rte-justify-center shr-rte-rounded-s shr-rte-text-base shr-rte-text-grey hover:shr-rte-bg-white-darken hover:shr-rte-text-black data-[active]:shr-rte-bg-white-darken data-[active]:shr-rte-text-black',
  dropLine:
    'shr-rte-pointer-events-none shr-rte-absolute shr-rte-z-1 shr-rte-h-[2px] shr-rte-bg-main forced-colors:shr-rte-bg-[color:Highlight]',
}

type Props = {
  editor: Editor
  containerRef: RefObject<HTMLElement | null>
}

type Hover = { index: number; top: number; menuOpen: boolean }
type DropLine = { top: number; left: number; width: number }

export const BlockHandle: FC<Props> = memo(({ editor, containerRef }) => {
  const { localize } = useIntl()
  const [hover, setHover] = useState<Hover | null>(null)
  const [dropLine, setDropLine] = useState<DropLine | null>(null)
  const pointerYRef = useRef<number | null>(null)
  const menuIndexRef = useRef<number | null>(null)
  const menuOpenAtMouseDownRef = useRef(false)
  const frameRef = useRef<number | null>(null)

  const latest = useLatest({ editor, hover, containerRef })

  const functions = useMemo(() => {
    const measure = () => {
      frameRef.current = null

      const container = latest.containerRef.current

      // ドラッグ中に隠すと、掴んでいる ⋮⋮ が外れて dragend が届かない
      if (!container || latest.editor.isDestroyed || latest.editor.storage.blockActions?.dragSource)
        return

      const viewRect = latest.editor.view.dom.getBoundingClientRect()
      const pointerY = pointerYRef.current
      const menuIndex = menuIndexRef.current
      // メニューは wrapper の外にあり、ポインタを移すと mouseleave が来る。⋮⋮ から開いた間はそれでも隠さない
      const menuOpen = menuIndex !== null && menuIndex < latest.editor.state.doc.childCount

      if (
        !menuOpen &&
        (pointerY === null || pointerY < viewRect.top || pointerY > viewRect.bottom)
      ) {
        setHover(null)

        return
      }

      const rects = getBlockRects(latest.editor.view)
      const index = menuOpen ? menuIndex : findBlockIndex(rects, pointerY!)
      const top = Math.max(rects[index].top, viewRect.top) - getControlOrigin(container).top

      setHover((prev) =>
        prev?.index === index && prev.top === top && prev.menuOpen === menuOpen
          ? prev
          : { index, top, menuOpen },
      )
    }

    const schedule = () => {
      frameRef.current ??= requestAnimationFrame(measure)
    }

    // 測ってから文書が変わると（value の反映など）、測った番号のブロックがもう無いことがある
    const hoveredRange = () => {
      const index = latest.hover?.index

      return index !== undefined && index < latest.editor.state.doc.childCount
        ? blockRangeAt(latest.editor.state.doc, index)
        : null
    }

    return {
      handleLayoutChange: schedule,
      handleHide: () => {
        pointerYRef.current = null
        schedule()
      },
      handlePointerMove: (e: globalThis.MouseEvent) => {
        // sticky のツールバーは本文に重なるので、本文の範囲だけでは判定できない
        pointerYRef.current = (e.target as Element).closest('[role="toolbar"]') ? null : e.clientY
        schedule()
      },
      handleTransaction: ({ transaction }: { transaction: Transaction }) => {
        if (transaction.docChanged) schedule()
      },
      handleDropTargetChange: (boundary: number | null) => {
        const container = latest.containerRef.current

        if (boundary === null || !container) {
          setDropLine(null)

          return
        }

        const rects = getBlockRects(latest.editor.view)
        const viewRect = latest.editor.view.dom.getBoundingClientRect()
        const { paddingLeft, paddingRight } = getComputedStyle(latest.editor.view.dom)
        const y =
          boundary === 0
            ? rects[0].top
            : boundary === rects.length
              ? rects[boundary - 1].bottom
              : (rects[boundary - 1].bottom + rects[boundary].top) / 2
        const origin = getControlOrigin(container)
        const next = {
          // 高さを固定した本文では、スクロールで隠れた境界が本文の外（ツールバーの上など）に出る
          top: Math.min(Math.max(y, viewRect.top), viewRect.bottom) - origin.top,
          left: viewRect.left + parseFloat(paddingLeft) - origin.left,
          width: viewRect.width - parseFloat(paddingLeft) - parseFloat(paddingRight),
        }

        setDropLine((prev) =>
          prev?.top === next.top && prev.left === next.left && prev.width === next.width
            ? prev
            : next,
        )
      },
      handleDelegateGripMouseDown: () => {
        // click の時点では、mousedown を外のクリックとみなしたメニューがもう閉じている
        menuOpenAtMouseDownRef.current = menuIndexRef.current !== null
      },
      handleDelegateGripClick: (e: MouseEvent<HTMLDivElement>) => {
        const container = latest.containerRef.current
        const openMenu = latest.editor.storage.blockActions?.openMenu
        const range = hoveredRange()

        if (menuOpenAtMouseDownRef.current || !container || !openMenu || !range) return

        const grip = e.currentTarget.getBoundingClientRect()
        const offsetLeft = grip.left - getControlOrigin(container).left
        let top = grip.top

        menuIndexRef.current = range.startIndex
        schedule()
        openMenu(range, {
          // ⋮⋮ 自身は測らない。本文の内側のスクロールでは ⋮⋮ が 1 フレーム遅れて動き、メニューが前の位置に取り残される
          getAnchorRect: () => {
            const block = latest.editor.view.nodeDOM(range.from)

            // 文書が変わってから閉じるまでの間にも測られ、そのときにはブロックが無いことがある
            if (block instanceof HTMLElement) {
              top = Math.max(
                block.getBoundingClientRect().top,
                latest.editor.view.dom.getBoundingClientRect().top,
              )
            }

            const left = getControlOrigin(container).left + offsetLeft

            return { top, bottom: top + grip.height, left, right: left + grip.width }
          },
          onClose: () => {
            menuIndexRef.current = null
            schedule()
          },
        })
      },
      handleDelegateGripDragStart: (e: DragEvent<HTMLDivElement>) => {
        const storage = latest.editor.storage.blockActions
        const range = hoveredRange()

        if (!range || !storage) return

        const dom = latest.editor.view.nodeDOM(range.from)

        e.dataTransfer.effectAllowed = 'move'
        // Firefox は何かを setData しないとドラッグを始めない
        e.dataTransfer.setData(BLOCK_DRAG_TYPE, String(range.startIndex))

        if (dom instanceof HTMLElement) e.dataTransfer.setDragImage(dom, 0, 0)

        storage.dragSource = range
        latest.containerRef.current?.setAttribute(BLOCK_DRAGGING_ATTRIBUTE, '')
      },
      handleDelegateGripDragEnd: () => {
        const storage = latest.editor.storage.blockActions

        if (storage) storage.dragSource = null

        latest.containerRef.current?.removeAttribute(BLOCK_DRAGGING_ATTRIBUTE)
        setDropLine(null)
        // ドラッグ中は mousemove が届かず、最後に測ったポインタの位置はもう古い
        pointerYRef.current = null
        schedule()
      },
    }
  }, [latest])

  useEffect(() => {
    const container = latest.containerRef.current
    const storage = editor.storage.blockActions

    if (!container || !storage) return undefined

    storage.handleDropTargetChange = functions.handleDropTargetChange
    container.addEventListener('mousemove', functions.handlePointerMove)
    container.addEventListener('mouseleave', functions.handleHide)
    editor.view.dom.addEventListener('keydown', functions.handleHide)
    // bubble で受けないのは、要素のスクロールは window まで bubble せず、本文の内側のスクロールを拾えないため
    window.addEventListener('scroll', functions.handleLayoutChange, true)
    // update では足りない。value の反映は emitUpdate: false で、update を出さずにブロックを減らす
    editor.on('transaction', functions.handleTransaction)

    const observer = new ResizeObserver(functions.handleLayoutChange)

    observer.observe(editor.view.dom)

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null

      if (storage.handleDropTargetChange === functions.handleDropTargetChange) {
        storage.handleDropTargetChange = null
      }

      // ⋮⋮ を掴んだまま消える（readOnly になるなど）と、dragend を受け取れない
      storage.dragSource = null
      container.removeAttribute(BLOCK_DRAGGING_ATTRIBUTE)

      container.removeEventListener('mousemove', functions.handlePointerMove)
      container.removeEventListener('mouseleave', functions.handleHide)
      editor.view.dom.removeEventListener('keydown', functions.handleHide)
      window.removeEventListener('scroll', functions.handleLayoutChange, true)
      editor.off('transaction', functions.handleTransaction)
      observer.disconnect()
    }
  }, [editor, functions, latest])

  return (
    <>
      {hover && (
        // ホバーでしか見えないものを読み上げや Tab の順に入れない。キーボードの経路は Mod+/・移動のキー
        <div className={CLASS_NAMES.wrapper} style={{ top: hover.top }} aria-hidden="true">
          {/* button にしないのは、Firefox が button からのドラッグを始めないため https://bugzilla.mozilla.org/show_bug.cgi?id=568313 */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            draggable
            title={localize({
              id: 'smarthr-ui/RichTextEditor/blockHandle',
              defaultText: 'ドラッグで移動、クリックでメニューを開く',
            })}
            className={CLASS_NAMES.grip}
            data-active={hover.menuOpen || undefined}
            onMouseDown={functions.handleDelegateGripMouseDown}
            onClick={functions.handleDelegateGripClick}
            onDragStart={functions.handleDelegateGripDragStart}
            onDragEnd={functions.handleDelegateGripDragEnd}
          >
            <FaGripVerticalIcon />
          </div>
        </div>
      )}
      {dropLine && <div className={CLASS_NAMES.dropLine} style={dropLine} aria-hidden="true" />}
    </>
  )
})
