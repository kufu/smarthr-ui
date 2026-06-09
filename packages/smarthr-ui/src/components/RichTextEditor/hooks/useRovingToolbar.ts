'use client'

import { type KeyboardEvent, useCallback, useRef, useState } from 'react'

type UseRovingToolbarOptions = {
  disabledKeys?: Set<number>
  onEscape?: () => void
}

export const useRovingToolbar = ({ disabledKeys, onEscape }: UseRovingToolbarOptions = {}) => {
  const [activeIndex, setActiveIndex] = useState(-1)
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([])

  const setButtonRef = useCallback(
    (index: number) => (el: HTMLButtonElement | null) => {
      buttonsRef.current[index] = el
    },
    [],
  )

  const isDisabled = useCallback(
    (index: number) => disabledKeys?.has(index) ?? false,
    [disabledKeys],
  )

  const findNextEnabled = useCallback(
    (from: number, count: number, direction: 1 | -1): number | null => {
      for (let i = 0; i < count; i++) {
        const idx = (from + direction * (i + 1) + count) % count
        if (!isDisabled(idx)) return idx
      }
      return null
    },
    [isDisabled],
  )

  const findFirstEnabled = useCallback(
    (count: number): number | null => {
      for (let i = 0; i < count; i++) {
        if (!isDisabled(i)) return i
      }
      return null
    },
    [isDisabled],
  )

  const findLastEnabled = useCallback(
    (count: number): number | null => {
      for (let i = count - 1; i >= 0; i--) {
        if (!isDisabled(i)) return i
      }
      return null
    },
    [isDisabled],
  )

  const focusButton = useCallback((index: number) => {
    buttonsRef.current[index]?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (index: number, count: number) => (e: KeyboardEvent) => {
      let nextIndex: number | null = null

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          nextIndex = findNextEnabled(index, count, 1)
          break
        case 'ArrowLeft':
          e.preventDefault()
          nextIndex = findNextEnabled(index, count, -1)
          break
        case 'Home':
          e.preventDefault()
          nextIndex = findFirstEnabled(count)
          break
        case 'End':
          e.preventDefault()
          nextIndex = findLastEnabled(count)
          break
        case 'Escape':
          e.preventDefault()
          onEscape?.()
          return
      }

      if (nextIndex !== null) {
        setActiveIndex(nextIndex)
        focusButton(nextIndex)
      }
    },
    [focusButton, onEscape, findNextEnabled, findFirstEnabled, findLastEnabled],
  )

  const getButtonProps = useCallback(
    (index: number, count: number) => {
      const effectiveActive =
        activeIndex >= 0 && !isDisabled(activeIndex) ? activeIndex : findFirstEnabled(count)

      return {
        ref: setButtonRef(index),
        tabIndex: index === effectiveActive ? 0 : -1,
        onKeyDown: handleKeyDown(index, count),
        onFocus: () => setActiveIndex(index),
      }
    },
    [activeIndex, isDisabled, setButtonRef, handleKeyDown, findFirstEnabled],
  )

  return { activeIndex, setActiveIndex, getButtonProps, focusButton }
}
