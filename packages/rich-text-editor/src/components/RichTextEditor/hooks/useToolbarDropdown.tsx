'use client'

import {
  type Dispatch,
  type MutableRefObject,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useEnhancedEffect } from '../../../hooks/useEnhancedEffect'
import { usePortal } from '../../../hooks/usePortal'

const GAP = 2
const VIEWPORT_PADDING = 10

const SCROLLABLE_OVERFLOW = /^(auto|scroll|overlay)$/

/**
 * トリガーを内包する最も近いスクロールコンテナを、ツールバーの内側に限って探す。
 *
 * 探索を role="toolbar" で打ち切っているのが要点。祖先を body まで遡ると、どの要素が
 * スクロールの購読先になるかが利用者側のツリー次第になってしまう。実際 RichTextEditor を
 * Dialog に置くと DialogBody の Scroller（overflow-y-auto）や ModelessDialog の
 * overflow-auto に行き当たるため、デスクトップでもダイアログ本文をスクロールしただけで
 * ドロップダウンが閉じる。LinkButton や YoutubeInsertButton のように入力欄を持つものでは
 * 入力中の値まで捨てることになる。閉じたいのは「トリガーと一緒に動く段」がスクロールした
 * ときだけなので、ツールバーの外は最初から見に行かない。
 *
 * ページスクロールで座標が追従しないのはこのhookの全利用者に共通の既存挙動であり、
 * ここでは扱わない。
 */
const findScrollContainer = (el: HTMLElement | null): HTMLElement | null => {
  // クラス名ではなくロールを境界にする。段の className は tv() 生成で識別子にできない一方、
  // role="toolbar" はツールバーの定義そのものなので、段構成を変えても境界がずれない
  const toolbar = el?.closest('[role="toolbar"]')

  if (!toolbar) return null

  let current: HTMLElement | null = el?.parentElement ?? null

  while (current && toolbar.contains(current)) {
    const { overflowX, overflowY } = getComputedStyle(current)

    if (SCROLLABLE_OVERFLOW.test(overflowX) || SCROLLABLE_OVERFLOW.test(overflowY)) {
      return current
    }

    current = current.parentElement
  }

  return null
}

type Position = {
  top: number
  left: number
  maxHeight?: number
}

type UseToolbarDropdownReturn = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  triggerRef: MutableRefObject<HTMLButtonElement | null>
  renderDropdown: (children: ReactNode) => ReactNode | null
}

export function useToolbarDropdown(): UseToolbarDropdownReturn {
  const { createPortal, isChildPortal } = usePortal()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 })
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

    const triggerRect = triggerEl.getBoundingClientRect()
    const contentHeight = contentEl.offsetHeight
    const spaceBelow = window.innerHeight - triggerRect.bottom - GAP
    const spaceAbove = triggerRect.top - GAP
    const fitsBelow = contentHeight <= spaceBelow
    const fitsAbove = contentHeight <= spaceAbove

    const contentWidth = contentEl.offsetWidth
    const rightEdge = triggerRect.left + contentWidth

    const next: Position = {
      top: 0,
      left:
        rightEdge > window.innerWidth - VIEWPORT_PADDING
          ? Math.max(VIEWPORT_PADDING, window.innerWidth - contentWidth - VIEWPORT_PADDING) +
            window.pageXOffset
          : triggerRect.left + window.pageXOffset,
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

    // スクロール位置は座標を測ったこの時点で記録する。トリガーへの focus() が
    // scroll-into-view を起こしていた場合、その scroll イベントは購読開始より後に届きうるので、
    // 実測値と比べて「開いた時点から動いていない」分を弾けるようにしておく
    const scrollContainer = findScrollContainer(triggerEl)

    scrollContainerRef.current = scrollContainer
    scrollOffsetRef.current = {
      left: scrollContainer?.scrollLeft ?? 0,
      top: scrollContainer?.scrollTop ?? 0,
    }

    setPosition(next)
    setIsVisible(true)
  }, [isOpen])

  // 座標は開いた時点で1度だけ算出するため、トリガーを内包する段が横スクロールすると
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

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (!triggerRef.current?.contains(target) && !isChildPortal(target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)

    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, isChildPortal])

  const renderDropdown = useCallback(
    (children: ReactNode) => {
      if (!isOpen) return null

      return createPortal(
        <div
          ref={contentRef}
          className={`shr-absolute shr-z-overlap-base ${isVisible ? 'shr-visible' : 'shr-invisible'}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            maxHeight: position.maxHeight ? `${position.maxHeight}px` : undefined,
            overflowY: position.maxHeight ? 'auto' : undefined,
          }}
        >
          {children}
        </div>,
      )
    },
    [isOpen, position, isVisible, createPortal],
  )

  return { isOpen, setIsOpen, triggerRef, renderDropdown }
}
