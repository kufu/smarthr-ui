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

  useEnhancedEffect(() => {
    if (!isOpen) {
      setIsVisible(false)

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

    setPosition(next)
    setIsVisible(true)
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
