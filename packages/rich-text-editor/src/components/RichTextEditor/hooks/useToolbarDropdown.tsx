'use client'

import {
  type Dispatch,
  type MutableRefObject,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { flushSync } from 'react-dom'

import { useEnhancedEffect } from '../../../hooks/client/useEnhancedEffect'
import { usePortal } from '../../../hooks/client/usePortal'

const GAP = 2
const VIEWPORT_PADDING = 10

const SCROLLABLE_OVERFLOW = /^(auto|scroll|overlay)$/

const getScrollableAxes = (el: Element) => {
  const { overflowX, overflowY } = getComputedStyle(el)

  return { x: SCROLLABLE_OVERFLOW.test(overflowX), y: SCROLLABLE_OVERFLOW.test(overflowY) }
}

const TABBABLE_SELECTOR =
  'a[href], button:not(:disabled), input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex]'

// 祖先を body まで遡る方式は採らない。Dialog に置くと DialogBody の Scroller などに行き当たり、
// ダイアログ本文をスクロールしただけで閉じて、入力中の値まで捨てることになるため
const findScrollContainer = (el: HTMLElement | null): HTMLElement | null => {
  // クラス名ではなくロールを境界にする。段の className は tv() 生成で識別子にできない一方、
  // role="toolbar" はツールバーの定義そのものなので、段構成を変えても境界がずれない
  const toolbar = el?.closest('[role="toolbar"]')

  if (!toolbar) return null

  let current: HTMLElement | null = el?.parentElement ?? null

  while (current && toolbar.contains(current)) {
    const overflow = getScrollableAxes(current)

    if (overflow.x || overflow.y) {
      return current
    }

    current = current.parentElement
  }

  return null
}

// スクロールバーの上かを座標で判定する方式は採らない。オーバーレイスクロールバーは幅を持たず、
// 枠線との区別も付かないため、スクロールできる要素自身への mousedown はまるごと妨げない
const isScrollable = (el: HTMLElement) => {
  const overflow = getScrollableAxes(el)

  return (
    (overflow.y && el.scrollHeight > el.clientHeight) ||
    (overflow.x && el.scrollWidth > el.clientWidth)
  )
}

type Position = {
  top: number
  left: number
  maxHeight?: number
}

type Options = {
  layoutKey?: unknown
  /**
   * トリガーに重ねず、その右隣（入らなければ左隣）へ置く。列のハンドルはトリガーの
   * 矩形が列幅そのものなので、既定の左端揃えでは選択中の列を完全に覆ってしまう
   */
  avoidTrigger?: boolean
  /**
   * true になったら閉じる。中身の送信ごとに editor.isEditable を確かめる方法は採らない。
   * 送信の経路が中身ごとに異なり、すべてに漏れなく入れるより、操作させない方が確実なため
   */
  disabled?: boolean
}

/** 右隣を優先し、入らなければ左隣。どちらも入らなければ null */
const resolveBesideLeft = (triggerRect: DOMRect, contentWidth: number) => {
  const right = triggerRect.right + GAP

  if (right + contentWidth <= window.innerWidth - VIEWPORT_PADDING) return right

  const left = triggerRect.left - GAP - contentWidth

  return left >= VIEWPORT_PADDING ? left : null
}

type UseToolbarDropdownReturn = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  triggerRef: MutableRefObject<HTMLButtonElement | null>
  renderDropdown: (children: ReactNode) => ReactNode | null
}

export function useToolbarDropdown({
  layoutKey,
  avoidTrigger,
  disabled,
}: Options = {}): UseToolbarDropdownReturn {
  const { createPortal, isChildPortal } = usePortal()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 })

  if (disabled && isOpen) setIsOpen(false)

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const scrollOffsetRef = useRef({ left: 0, top: 0 })

  useEnhancedEffect(() => {
    if (!isOpen) {
      setIsVisible(false)
      // 前回開いたときのコンテナを持ち越さない。座標を測れず下の早期returnに入った場合に、
      // 無関係な要素のスクロールを購読してしまうのを防ぐ
      scrollContainerRef.current = null

      return
    }

    const triggerEl = triggerRef.current
    const contentEl = contentRef.current

    if (!triggerEl || !contentEl) return

    const place = () => {
      const triggerRect = triggerEl.getBoundingClientRect()
      // 上限を付けたまま測ると縮んだ高さが返り、上限の付け外しを繰り返すため、外して測る
      const scrollables = [contentEl, contentEl.firstElementChild].filter(
        (el): el is Element => !!el,
      )
      const scrollTops = scrollables.map((el) => el.scrollTop)
      const { maxHeight, display } = contentEl.style
      contentEl.style.maxHeight = ''
      contentEl.style.display = ''
      const contentHeight = Math.max(contentEl.offsetHeight, contentEl.scrollHeight)
      contentEl.style.maxHeight = maxHeight
      contentEl.style.display = display
      scrollables.forEach((el, i) => {
        el.scrollTop = scrollTops[i]
      })
      const spaceBelow = window.innerHeight - triggerRect.bottom - GAP
      const spaceAbove = triggerRect.top - GAP
      const fitsBelow = contentHeight <= spaceBelow
      const fitsAbove = contentHeight <= spaceAbove

      const contentWidth = contentEl.offsetWidth
      const besideLeft = avoidTrigger ? resolveBesideLeft(triggerRect, contentWidth) : null
      const rightEdge = triggerRect.left + contentWidth

      const next: Position = {
        top: 0,
        left:
          (besideLeft ??
            (rightEdge > window.innerWidth - VIEWPORT_PADDING
              ? Math.max(VIEWPORT_PADDING, window.innerWidth - contentWidth - VIEWPORT_PADDING)
              : triggerRect.left)) + window.pageXOffset,
      }

      if (fitsBelow) {
        next.top = triggerRect.bottom + GAP + window.pageYOffset
      } else if (fitsAbove) {
        next.top = triggerRect.top - contentHeight - GAP + window.pageYOffset
      } else if (spaceBelow >= spaceAbove) {
        next.top = triggerRect.bottom + GAP + window.pageYOffset
        next.maxHeight = spaceBelow - VIEWPORT_PADDING
      } else {
        next.top = VIEWPORT_PADDING + window.pageYOffset
        next.maxHeight = spaceAbove - VIEWPORT_PADDING
      }

      setPosition((prev) =>
        prev.top === next.top && prev.left === next.left && prev.maxHeight === next.maxHeight
          ? prev
          : next,
      )
    }

    place()

    // スクロール位置は座標を測ったこの時点で記録する。トリガーへの focus() が
    // scroll-into-view を起こしていた場合、その scroll イベントは購読開始より後に届きうるので、
    // 実測値と比べて「開いた時点から動いていない」分を弾けるようにしておく
    const scrollContainer = findScrollContainer(triggerEl)

    scrollContainerRef.current = scrollContainer
    scrollOffsetRef.current = {
      left: scrollContainer?.scrollLeft ?? 0,
      top: scrollContainer?.scrollTop ?? 0,
    }

    setIsVisible(true)

    // 通知から React が描画するまでの間に、伸びた中身が前の位置のまま1フレーム描かれてしまう
    const resizeObserver = new ResizeObserver(() => flushSync(place))

    resizeObserver.observe(contentEl)
    // maxHeight で頭打ちになると外枠の大きさは変わらないので、中身も見る
    if (contentEl.firstElementChild) resizeObserver.observe(contentEl.firstElementChild)

    const handleResize = () => flushSync(place)

    window.addEventListener('resize', handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, layoutKey, avoidTrigger])

  // 座標はトリガーの移動に追従しないため、トリガーを内包する段が横スクロールすると
  // ドロップダウンだけが元の位置に取り残される。タッチスクロール中は mousedown が発生せず
  // 外側クリックの購読でも閉じられないので、スクロール自体を閉じる契機にする
  useEffect(() => {
    if (!isOpen) return

    const scrollContainer = scrollContainerRef.current

    if (!scrollContainer) return

    const handler = () => {
      if (
        scrollContainer.scrollLeft === scrollOffsetRef.current.left &&
        scrollContainer.scrollTop === scrollOffsetRef.current.top
      ) {
        return
      }

      // フォーカスがドロップダウン内にあるときだけトリガーへ戻す。無条件に focus() すると
      // 指でスクロールしただけの場面でトリガーが画面内へ引き戻され、スクロール操作と喧嘩する
      const shouldRestoreFocus = contentRef.current?.contains(document.activeElement)

      setIsOpen(false)

      if (shouldRestoreFocus) triggerRef.current?.focus()
    }

    scrollContainer.addEventListener('scroll', handler)

    return () => scrollContainer.removeEventListener('scroll', handler)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const isInside = (target: HTMLElement) =>
      !!triggerRef.current?.contains(target) || isChildPortal(target)

    const handleMouseDown = (e: MouseEvent) => {
      if (!isInside(e.target as HTMLElement)) {
        setIsOpen(false)
      }
    }

    // トリガーの onKeyDown で拾うと、ツールバーの roving が Escape を本文へのフォーカス移動に
    // 使うため先に処理される。キャプチャで受けてトリガーへ届く前に閉じる
    const handleKeyDown = (e: KeyboardEvent) => {
      // ドロップダウン内の Escape は各コンポーネントがトリガーへフォーカスを戻して閉じる
      if (e.key === 'Escape' && !isChildPortal(e.target as HTMLElement)) {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(false)

        // 無条件にトリガーへ戻す方式は採らない。中身にフォーカスがある間は戻り先を中身が決める
        // （表のメニューはセルへ戻す）
        if (document.activeElement === document.body) triggerRef.current?.focus()
      }
    }

    // focusout の relatedTarget は中身の余白をクリックしたときも null になり区別できないため、
    // フォーカスが実際に移った先を focusin で見る
    const handleFocusIn = (e: FocusEvent) => {
      if (!isInside(e.target as HTMLElement)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('focusin', handleFocusIn)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('focusin', handleFocusIn)
    }
  }, [isOpen, isChildPortal])

  const functions = useMemo(
    () => ({
      // ポータルは body 末尾にあり、両端から Tab で抜けるとフォーカスがページの外や
      // ページ末尾の要素へ飛んで開いたまま残る。中身ごとに書くと漏れるため外枠で受ける
      handleDelegateKeyDown: (e: ReactKeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Tab' || e.defaultPrevented || e.nativeEvent.isComposing) return

        const tabbables = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR),
        ).filter((el) => el.tabIndex >= 0)
        const index = tabbables.indexOf(e.target as HTMLElement)
        const isEdge = e.shiftKey ? index === 0 : index !== -1 && index === tabbables.length - 1

        if (isEdge) {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(false)
          triggerRef.current?.focus()
        }
      },
      // フォーカスが中にないときは止めない。マウスで開いてトリガーにフォーカスが残っている場合、
      // 止めると次の Tab がツールバーの外へ抜けて閉じる。止めなければ押した位置が Tab の起点になる
      handleDelegateMouseDown: (e: ReactMouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement

        if (
          e.button === 0 &&
          e.currentTarget.contains(target) &&
          e.currentTarget.contains(document.activeElement) &&
          !e.currentTarget.contains(target.closest(TABBABLE_SELECTOR)) &&
          !isScrollable(target)
        ) {
          e.preventDefault()
        }
      },
    }),
    [],
  )

  const renderDropdown = useCallback(
    (children: ReactNode) => {
      if (!isOpen) return null

      return createPortal(
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          ref={contentRef}
          className={`shr-rte-absolute shr-rte-z-overlap-base ${isVisible ? 'shr-rte-visible' : 'shr-rte-invisible'}`}
          style={{
            // 既定の縮む幅だと、画面の右端に近いときに縮んだ値で測られ、端からの余白を確保できない
            width: 'max-content',
            maxWidth: `calc(100vw - ${VIEWPORT_PADDING * 2}px)`,
            top: `${position.top}px`,
            left: `${position.left}px`,
            maxHeight: position.maxHeight ? `${position.maxHeight}px` : undefined,
            overflowY: position.maxHeight ? 'auto' : undefined,
            // 外枠だけで頭打ちにすると、自前でスクロールする中身（リストボックス）と二重にスクロールバーが出る
            display: position.maxHeight ? 'flex' : undefined,
            flexDirection: position.maxHeight ? 'column' : undefined,
          }}
          onMouseDown={functions.handleDelegateMouseDown}
          onKeyDown={functions.handleDelegateKeyDown}
        >
          {children}
        </div>,
      )
    },
    [isOpen, position, isVisible, createPortal, functions],
  )

  return { isOpen, setIsOpen, triggerRef, renderDropdown }
}
