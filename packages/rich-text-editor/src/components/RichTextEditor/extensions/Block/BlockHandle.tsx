'use client'

import { keydownHandler } from '@tiptap/pm/keymap'
import { Selection } from '@tiptap/pm/state'
import {
  type DragEvent,
  type FC,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import { FaGripVerticalIcon } from 'smarthr-ui'

import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'
import { isActiveElement } from '../../../../libs/activeElement'
import { isApplePlatform } from '../../hooks/useIsApplePlatform'
import { describeBlock, describeSubject } from '../blockCatalog'
import { getControlOrigin } from '../floatingGeometry'

import { BLOCK_DRAG_TYPE, getBlockRects } from './BlockActions'
import {
  type BlockRange,
  blockRangeAt,
  blockStartSelection,
  findBlockIndex,
  resolveBlockRange,
} from './blockRange'
import { getBlockShortcuts } from './blockShortcuts'

import type { Transaction } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/react'

const BLOCK_DRAGGING_ATTRIBUTE = 'data-block-dragging'

const CLASS_NAMES = {
  // 本文の左の余白（pl-2.5 = 40px）に置き、右端を本文の 8px 左に揃える。
  // 表の行ハンドルは本文の 2px 左から始まり、重ならない
  wrapper:
    'shr-rte-absolute shr-rte-left-0 shr-rte-z-1 shr-rte-flex shr-rte-w-[32px] shr-rte-items-center shr-rte-justify-end',
  grip: 'shr-rte-box-border shr-rte-flex shr-rte-h-[24px] shr-rte-w-[24px] shr-rte-cursor-grab shr-rte-items-center shr-rte-justify-center shr-rte-rounded-s shr-rte-text-base shr-rte-text-grey hover:shr-rte-bg-white-darken hover:shr-rte-text-black focus-visible:shr-rte-focus-indicator data-[keyboard-focus]:shr-rte-focus-indicator data-[active]:shr-rte-bg-white-darken data-[active]:shr-rte-text-black',
  dropLine:
    'shr-rte-pointer-events-none shr-rte-absolute shr-rte-z-1 shr-rte-h-[2px] shr-rte-bg-main forced-colors:shr-rte-bg-[color:Highlight]',
}

type Props = {
  editor: Editor
  containerRef: RefObject<HTMLElement | null>
}

type Target = {
  index: number
  top: number
  menuOpen: boolean
  label: string
  keyboardFocus: boolean
}

const MUTED_KEYS = ['Backspace', 'Delete', 'Shift', 'Control', 'Alt', 'AltGraph', 'Meta']
type DropLine = { top: number; left: number; width: number }

export const BlockHandle: FC<Props> = memo(({ editor, containerRef }) => {
  const { localize } = useIntl()
  const [target, setTarget] = useState<Target | null>(null)
  const [dropLine, setDropLine] = useState<DropLine | null>(null)
  const gripRef = useRef<HTMLDivElement>(null)
  const pointerYRef = useRef<number | null>(null)
  const menuIndexRef = useRef<number | null>(null)
  const menuOpenAtMouseDownRef = useRef(false)
  // マウスで押して付いたフォーカスでは立てない。押してから離すまでにキャレットのブロックへ移り、押したのと別のブロックのメニューが開く
  const keyboardFocusRef = useRef(false)
  const frameRef = useRef<number | null>(null)

  const latest = useLatest({ editor, target, containerRef, localize })

  const functions = useMemo(() => {
    const rectOf = (index: number) => {
      const { view, state } = latest.editor
      const dom = view.nodeDOM(blockRangeAt(state.doc, index).from)

      return dom instanceof HTMLElement ? dom.getBoundingClientRect() : new DOMRect()
    }

    const measure = () => {
      frameRef.current = null

      const container = latest.containerRef.current
      const { editor: currentEditor } = latest

      // ドラッグ中に隠すと、掴んでいる ⋮⋮ が外れて dragend が届かない
      if (!container || currentEditor.isDestroyed || currentEditor.storage.blockActions?.dragSource)
        return

      const { view, state } = currentEditor
      const viewRect = view.dom.getBoundingClientRect()
      const pointerY = pointerYRef.current
      const menuIndex = menuIndexRef.current
      // メニューは wrapper の外にあり、ポインタを移すと mouseleave が来る。⋮⋮ から開いた間はそれでも隠さない
      const menuOpen = menuIndex !== null && menuIndex < state.doc.childCount
      const grip = gripRef.current
      let index: number | null = null
      let rect: DOMRect | null = null

      if (menuOpen) {
        index = menuIndex
      } else if (keyboardFocusRef.current) {
        // キーボードで ⋮⋮ にいる間はポインタに従わない。ずれると、見ているのと別のブロックに Enter が効く
        index = resolveBlockRange(state.doc, state.selection).startIndex
      } else if (pointerY !== null && pointerY >= viewRect.top && pointerY <= viewRect.bottom) {
        // すべてのブロックを測るのはポインタのときだけにする。打つたびに測ると、長い文書で打鍵が遅れる
        const rects = getBlockRects(view)

        index = findBlockIndex(rects, pointerY)
        rect = rects[index]
      } else if (isActiveElement(grip) && latest.target) {
        // フォーカスのある ⋮⋮ を消すと、フォーカスが body へ落ち、消えた要素からは blur も届かない
        index = Math.min(latest.target.index, state.doc.childCount - 1)
      } else if (view.hasFocus()) {
        const caretIndex = resolveBlockRange(state.doc, state.selection).startIndex
        const caretRect = rectOf(caretIndex)

        // 高さを固定した本文でスクロールして見えなくなったブロックに出すと、本文の外に描かれる
        if (caretRect.bottom >= viewRect.top && caretRect.top <= viewRect.bottom) {
          index = caretIndex
          rect = caretRect
        }
      }

      if (index === null) {
        setTarget(null)

        return
      }

      const top =
        Math.max((rect ?? rectOf(index)).top, viewRect.top) - getControlOrigin(container).top
      const label = latest.localize(
        { id: 'smarthr-ui/RichTextEditor/blockHandleLabel', defaultText: '{block}の操作' },
        {
          block: describeSubject(
            { ...describeBlock(state.doc.child(index)), count: 1 },
            latest.localize,
          ),
        },
      )

      // 枠を :focus-visible だけで描かないのは、Safari がスクリプトから移したフォーカスに付けないことがあるため
      const keyboardFocus = keyboardFocusRef.current

      setTarget((prev) =>
        prev?.index === index &&
        prev.top === top &&
        prev.menuOpen === menuOpen &&
        prev.label === label &&
        prev.keyboardFocus === keyboardFocus
          ? prev
          : { index, top, menuOpen, label, keyboardFocus },
      )
    }

    const schedule = () => {
      frameRef.current ??= requestAnimationFrame(measure)
    }

    // 測ってから文書が変わると（value の反映など）、測った番号のブロックがもう無いことがある
    const targetRange = () => {
      const index = latest.target?.index

      return index !== undefined && index < latest.editor.state.doc.childCount
        ? blockRangeAt(latest.editor.state.doc, index)
        : null
    }

    const focusGrip = () => {
      // 予約を残したまま直接測ると、measure が予約の番号を消し、アンマウントしても取り消せないまま走る
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)

      keyboardFocusRef.current = true
      flushSync(measure)

      const grip = gripRef.current

      if (grip) {
        // 別のブロックへ移っても要素は同じなので、付け直さないと読み上げが新しい名前を読まない
        if (isActiveElement(grip)) grip.blur()
        grip.focus()
      }

      keyboardFocusRef.current = isActiveElement(grip)

      return keyboardFocusRef.current
    }

    // 項目を選ぶと、閉じる処理と、文書が変わって閉じる処理の両方から呼ばれる。2 回戻すと 2 回読み上げる
    let returnPending = false

    const returnToGrip = () => {
      // 開いていた印を残したまま戻ると、閉じたメニューをまだ開いていると読み上げる
      menuIndexRef.current = null

      if (!returnPending) {
        returnPending = true
        // その場で戻さないのは、選んだ項目の操作がこのあとに走り、戻った ⋮⋮ が操作前の名前を読み上げるため。
        // value の同期の effect の中で閉じたときに、flushSync が効かないのも避ける
        queueMicrotask(() => {
          returnPending = false

          // 戻せないときに本文へ戻すのは、BlockMenu の既定の戻し先を置き換えていて、ほかに戻る先が無いため
          if (!latest.editor.isDestroyed && !focusGrip()) latest.editor.view.focus()
        })
      }
    }

    const openMenu = (grip: HTMLElement, returnFocus?: () => void) => {
      const container = latest.containerRef.current
      const open = latest.editor.storage.blockActions?.openMenu
      const range = targetRange()

      if (!container || !open || !range) return

      const gripRect = grip.getBoundingClientRect()
      const offsetLeft = gripRect.left - getControlOrigin(container).left
      let top = gripRect.top

      menuIndexRef.current = range.startIndex
      schedule()
      open(range, {
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

          return { top, bottom: top + gripRect.height, left, right: left + gripRect.width }
        },
        onClose: () => {
          menuIndexRef.current = null
          schedule()
        },
        returnFocus,
      })
    }

    // キャレットの位置のまま効かせないのは、マウスで押して付いたフォーカスではキャレットが別のブロックにあり、⋮⋮ と違うブロックに効くため
    const select = (selection: Selection | null) => {
      const { view } = latest.editor

      if (selection) view.dispatch(view.state.tr.setSelection(selection).scrollIntoView())
    }

    const alignCaret = (range: BlockRange) => {
      const { doc, selection } = latest.editor.state

      if (resolveBlockRange(doc, selection).startIndex !== range.startIndex) {
        select(blockStartSelection(doc, range.startIndex))
      }
    }

    // ⋮⋮ での ⌘/ を本文と同じに効かせないのは、BlockActions のメニューの開き方では閉じたあと本文へ戻り、Enter と食い違うため
    const isMenuShortcut = keydownHandler({
      [getBlockShortcuts(isApplePlatform()).menu]: () => true,
    })

    const runShortcut = (range: BlockRange, event: globalThis.KeyboardEvent) => {
      const { view } = latest.editor
      const before = view.state.selection

      alignCaret(range)

      // 本文へ移してから効かせないのは、ブロックを続けて動かすたびに ← で ⋮⋮ へ戻ることになるため
      const handled = Boolean(view.someProp('handleKeyDown', (handler) => handler(view, event)))

      // 効かなかったキーでキャレットを動かしたままにしない
      if (!handled && !view.state.selection.eq(before)) {
        view.dispatch(view.state.tr.setSelection(before))
      }

      return handled
    }

    const openMenuFromKeyboard = (grip: HTMLElement) => {
      const range = targetRange()

      if (range) alignCaret(range)

      keyboardFocusRef.current = true
      openMenu(grip, returnToGrip)
    }

    return {
      focusGrip,
      handleLayoutChange: schedule,
      // キーを押してもポインタの位置に出し続けないのは、打っている行から離れたブロックに ⋮⋮ が残るため
      handlePointerReset: () => {
        pointerYRef.current = null
        schedule()
      },
      handlePointerMove: (e: globalThis.MouseEvent) => {
        // sticky のツールバーは本文に重なるので、本文の範囲だけでは判定できない
        pointerYRef.current = (e.target as Element).closest('[role="toolbar"]') ? null : e.clientY
        schedule()
      },
      handleTransaction: ({ transaction }: { transaction: Transaction }) => {
        if (transaction.docChanged || transaction.selectionSet) schedule()
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
      handleGripMouseDown: () => {
        // click の時点では、mousedown を外のクリックとみなしたメニューがもう閉じている
        menuOpenAtMouseDownRef.current = menuIndexRef.current !== null
      },
      handleGripClick: (e: MouseEvent<HTMLDivElement>) => {
        // 支援技術はマウスを介さずに押し（detail が 0）、mousedown を送らない。前に押したときの印を残すと開かなくなる
        const isPointer = e.detail > 0
        const wasOpen = isPointer && menuOpenAtMouseDownRef.current

        menuOpenAtMouseDownRef.current = false

        if (wasOpen) {
          // ⋮⋮ にフォーカスを残さないのは、枠の無いままポインタを追い、次に押したキーがマウスの下のブロックに効くため
          latest.editor.view.focus()
        } else if (!isPointer || keyboardFocusRef.current) {
          // マウスを介さない押し方やキーボードで ⋮⋮ にいるときに本文へ戻すと、Enter で開いたときと戻り先が食い違う
          openMenuFromKeyboard(e.currentTarget)
        } else {
          openMenu(e.currentTarget)
        }
      },
      handleGripKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        // ポインタの位置を残さないのは、→ で本文へ戻ったときに、乗せたままのマウスの位置へ ⋮⋮ が跳ぶため
        pointerYRef.current = null

        // ⋮⋮ のまま既定の動きに任せないのは、⋮⋮ が DOM では表の操作ボタンなどの後ろにあり、
        // Shift+Tab がツールバーではなくそちらへ移るため。本文へ移してから任せる
        if (e.key === 'Tab') {
          latest.editor.view.focus()

          return
        }

        // Backspace・Delete を本文へ渡さないのは、⋮⋮ で押すと前のブロックとつながり、ブロックを消す操作と取り違えるため。
        // 修飾キーだけの押下を渡さないのは、何も効かないのにキャレットが ⋮⋮ のブロックへ動くため
        if (MUTED_KEYS.includes(e.key)) return

        const range = targetRange()

        if (!range || e.nativeEvent.isComposing) return

        const { view } = latest.editor
        const { doc } = view.state

        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
          switch (e.key) {
            case 'Enter':
            case ' ':
              e.preventDefault()
              openMenuFromKeyboard(e.currentTarget)

              return
            case 'ArrowRight':
              e.preventDefault()
              select(blockStartSelection(doc, range.startIndex))
              view.focus()

              return
            case 'ArrowLeft':
              e.preventDefault()

              if (range.startIndex > 0) {
                select(Selection.findFrom(doc.resolve(range.from), -1))
                view.focus()
              }

              return
            case 'ArrowUp':
            case 'ArrowDown': {
              e.preventDefault()

              const index = e.key === 'ArrowUp' ? range.startIndex - 1 : range.endIndex

              if (index >= 0 && index < doc.childCount) {
                select(blockStartSelection(doc, index))
                focusGrip()
              }

              return
            }
          }
        }

        if (isMenuShortcut(view, e.nativeEvent)) {
          e.preventDefault()
          openMenuFromKeyboard(e.currentTarget)
        } else if ((e.altKey || e.ctrlKey || e.metaKey) && runShortcut(range, e.nativeEvent)) {
          e.preventDefault()
        } else if (
          // Option や AltGr で打つ文字も、修飾キー付きのショートカットと区別して文字として扱う
          e.key === 'Process' ||
          (e.key.length === 1 &&
            (!(e.ctrlKey || e.metaKey) || e.nativeEvent.getModifierState('AltGraph')))
        ) {
          // 打った文字を本文へ渡さないのは、⋮⋮ の上では日本語入力が効かず、最初の 1 文字が英字のまま入るため
          e.preventDefault()
          alignCaret(range)
          view.focus()
        }
      },
      handleGripBlur: (e: FocusEvent<HTMLDivElement>) => {
        // ウィンドウを切り替えただけのとき（フォーカスのある要素は変わらない）に外すと、⋮⋮ が消えて戻る先が無くなる
        if (!isActiveElement(e.currentTarget)) {
          keyboardFocusRef.current = false
          schedule()
        }
      },
      handleGripDragStart: (e: DragEvent<HTMLDivElement>) => {
        const storage = latest.editor.storage.blockActions
        const range = targetRange()

        if (!range || !storage) return

        const dom = latest.editor.view.nodeDOM(range.from)

        e.dataTransfer.effectAllowed = 'move'
        // Firefox は何かを setData しないとドラッグを始めない
        e.dataTransfer.setData(BLOCK_DRAG_TYPE, String(range.startIndex))

        if (dom instanceof HTMLElement) e.dataTransfer.setDragImage(dom, 0, 0)

        storage.dragSource = range
        latest.containerRef.current?.setAttribute(BLOCK_DRAGGING_ATTRIBUTE, '')
      },
      handleGripDragEnd: () => {
        const storage = latest.editor.storage.blockActions

        if (storage) storage.dragSource = null

        latest.containerRef.current?.removeAttribute(BLOCK_DRAGGING_ATTRIBUTE)
        setDropLine(null)
        // ドラッグ中は mousemove が届かず、最後に測ったポインタの位置はもう古い
        pointerYRef.current = null
        schedule()

        // 取り消したドラッグで ⋮⋮ にフォーカスを残さないのは、枠の無いままポインタを追い、次に押したキーがマウスの下のブロックに効くため
        if (isActiveElement(gripRef.current)) latest.editor.view.focus()
      },
    }
  }, [latest])

  useEffect(() => {
    const container = latest.containerRef.current
    const { editor: currentEditor } = latest
    const storage = currentEditor.storage.blockActions

    if (!container || !storage) return undefined

    storage.handleDropTargetChange = functions.handleDropTargetChange
    storage.focusGrip = functions.focusGrip
    container.addEventListener('mousemove', functions.handlePointerMove)
    container.addEventListener('mouseleave', functions.handlePointerReset)
    currentEditor.view.dom.addEventListener('keydown', functions.handlePointerReset)
    // bubble で受けないのは、要素のスクロールは window まで bubble せず、本文の内側のスクロールを拾えないため
    window.addEventListener('scroll', functions.handleLayoutChange, true)
    // update では足りない。value の反映は emitUpdate: false で、update を出さずにブロックを減らす
    currentEditor.on('transaction', functions.handleTransaction)
    currentEditor.on('focus', functions.handleLayoutChange)
    currentEditor.on('blur', functions.handleLayoutChange)

    const observer = new ResizeObserver(functions.handleLayoutChange)

    observer.observe(currentEditor.view.dom)

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null

      if (storage.handleDropTargetChange === functions.handleDropTargetChange) {
        storage.handleDropTargetChange = null
      }

      if (storage.focusGrip === functions.focusGrip) storage.focusGrip = null

      // ⋮⋮ を掴んだまま消える（readOnly になるなど）と、dragend を受け取れない
      storage.dragSource = null
      container.removeAttribute(BLOCK_DRAGGING_ATTRIBUTE)

      container.removeEventListener('mousemove', functions.handlePointerMove)
      container.removeEventListener('mouseleave', functions.handlePointerReset)
      currentEditor.view.dom.removeEventListener('keydown', functions.handlePointerReset)
      window.removeEventListener('scroll', functions.handleLayoutChange, true)
      currentEditor.off('transaction', functions.handleTransaction)
      currentEditor.off('focus', functions.handleLayoutChange)
      currentEditor.off('blur', functions.handleLayoutChange)
      observer.disconnect()
    }
  }, [functions, latest])

  return (
    <>
      {target && (
        <div className={CLASS_NAMES.wrapper} style={{ top: target.top }}>
          {/* button にしないのは、Firefox が button からのドラッグを始めないため https://bugzilla.mozilla.org/show_bug.cgi?id=568313 */}
          {/* Tab の順に入れないのは、本文の次へ Tab で抜けるときに 1 回余計に止まるため。本文からは ← で移れる */}
          {/* eslint-disable-next-line smarthr/best-practice-for-interactive-element, smarthr/a11y-scroller-has-tabindex */}
          <div
            ref={gripRef}
            role="button"
            draggable
            tabIndex={-1}
            title={localize({
              id: 'smarthr-ui/RichTextEditor/blockHandle',
              defaultText: 'ドラッグで移動、クリックでメニューを開く',
            })}
            className={CLASS_NAMES.grip}
            aria-label={target.label}
            aria-haspopup="menu"
            aria-expanded={target.menuOpen}
            data-active={target.menuOpen || undefined}
            data-keyboard-focus={target.keyboardFocus || undefined}
            onMouseDown={functions.handleGripMouseDown}
            onClick={functions.handleGripClick}
            onKeyDown={functions.handleGripKeyDown}
            onBlur={functions.handleGripBlur}
            onDragStart={functions.handleGripDragStart}
            onDragEnd={functions.handleGripDragEnd}
          >
            <FaGripVerticalIcon />
          </div>
        </div>
      )}
      {dropLine && <div className={CLASS_NAMES.dropLine} style={dropLine} aria-hidden="true" />}
    </>
  )
})
