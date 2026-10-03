'use client'

import { type KeyboardEvent, useMemo, useRef, useState } from 'react'

import { useLatest } from '../../../hooks/useLatest'

type UseRovingToolbarOptions = {
  count: number
  disabledKeys?: Set<number>
  onEscape?: () => void
}

type ButtonHandlers = {
  ref: (el: HTMLButtonElement | null) => void
  onKeyDown: (e: KeyboardEvent) => void
  onFocus: () => void
}

export const useRovingToolbar = ({ count, disabledKeys, onEscape }: UseRovingToolbarOptions) => {
  const [activeIndex, setActiveIndex] = useState(-1)
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([])
  const latest = useLatest({ count, disabledKeys, onEscape })

  const functions = useMemo(() => {
    const isDisabled = (index: number) => latest.disabledKeys?.has(index) ?? false

    const findFirstEnabled = (): number | null => {
      for (let i = 0; i < latest.count; i++) {
        if (!isDisabled(i)) return i
      }
      return null
    }

    const findLastEnabled = (): number | null => {
      for (let i = latest.count - 1; i >= 0; i--) {
        if (!isDisabled(i)) return i
      }
      return null
    }

    const findNextEnabled = (from: number, direction: 1 | -1): number | null => {
      for (let i = 0; i < latest.count; i++) {
        const idx = (from + direction * (i + 1) + latest.count) % latest.count
        if (!isDisabled(idx)) return idx
      }
      return null
    }

    const handleKeyDown = (index: number, e: KeyboardEvent) => {
      let nextIndex: number | null = null

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          nextIndex = findNextEnabled(index, 1)
          break
        case 'ArrowLeft':
          e.preventDefault()
          nextIndex = findNextEnabled(index, -1)
          break
        case 'Home':
          e.preventDefault()
          nextIndex = findFirstEnabled()
          break
        case 'End':
          e.preventDefault()
          nextIndex = findLastEnabled()
          break
        case 'Escape':
          e.preventDefault()
          latest.onEscape?.()
          return
      }

      if (nextIndex !== null) {
        setActiveIndex(nextIndex)
        buttonsRef.current[nextIndex]?.focus()
      }
    }

    // 番号ごとに1度だけ作って使い回す。描画のたびに作ると memo された子がすべて描画し直され、
    // ref の参照も変わって React が全ボタンで付け外しを繰り返す
    const handlers = new Map<number, ButtonHandlers>()

    return {
      isDisabled,
      findFirstEnabled,
      getHandlers: (index: number): ButtonHandlers => {
        const cached = handlers.get(index)

        if (cached) return cached

        const created: ButtonHandlers = {
          ref: (el) => {
            buttonsRef.current[index] = el
          },
          onKeyDown: (e) => handleKeyDown(index, e),
          onFocus: () => setActiveIndex(index),
        }

        handlers.set(index, created)

        return created
      },
    }
  }, [latest])

  // activeIndex < count も見る。disabledKeys は count 未満の index しか持たないため、
  // 項目数が減ったあと（例: ブレークポイントを跨いで段組みが変わったとき）に
  // isDisabled だけでは描画されない index を弾けず、全項目が tabIndex=-1 になる
  const effectiveActive =
    activeIndex >= 0 && activeIndex < count && !(disabledKeys?.has(activeIndex) ?? false)
      ? activeIndex
      : functions.findFirstEnabled()

  const getButtonProps = (index: number) => ({
    ...functions.getHandlers(index),
    tabIndex: index === effectiveActive ? 0 : -1,
  })

  return { getButtonProps }
}
