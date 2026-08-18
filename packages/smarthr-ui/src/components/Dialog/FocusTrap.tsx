import {
  type PropsWithChildren,
  type RefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import { tabbable } from '../../libs/tabbable'

type Props = PropsWithChildren<{
  firstFocusTarget?: RefObject<HTMLElement>
}>

export type FocusTrapRef = {
  focus: () => void
}

export const FocusTrap = forwardRef<FocusTrapRef, Props>(({ firstFocusTarget, children }, ref) => {
  const innerRef = useRef<HTMLDivElement | null>(null)
  const dummyFocusRef = useRef<HTMLDivElement>(null)

  const functions = useMemo(
    () => ({
      focus: () => {
        ;(firstFocusTarget?.current || dummyFocusRef.current)?.focus()
      },
    }),
    [firstFocusTarget],
  )

  useImperativeHandle(ref, () => functions, [functions])

  useEffect(() => {
    // FocusTrap がマウントされた時点のフォーカス要素を保存
    const triggerElement = document.activeElement

    functions.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      // IME 変換中の Tab は変換候補の選択に使われるため、フォーカストラップの対象外にする。
      // ここで preventDefault してしまうと、Dialog 内で日本語入力中に Tab を押しても
      // 変換候補が確定されず、未確定文字列がそのまま入力されてしまう。
      if (e.key !== 'Tab' || e.isComposing || innerRef.current === null) {
        return
      }

      const tabbables = tabbable(innerRef.current).filter((elm) => elm.tabIndex >= 0)

      if (tabbables.length === 0) {
        return
      }

      const firstTabbable = tabbables[0]
      const lastTabbable = tabbables[tabbables.length - 1]
      const currentFocused = tabbables.find((elm) => elm === e.target)

      if (e.shiftKey) {
        if (currentFocused === firstTabbable || document.activeElement === dummyFocusRef.current) {
          e.preventDefault()
          lastTabbable.focus()
        }
      } else if (currentFocused === lastTabbable) {
        e.preventDefault()
        firstTabbable.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      // フォーカストラップ終了時にトリガにフォーカスを戻す
      if (triggerElement instanceof HTMLElement) {
        triggerElement.focus()
      }
    }
  }, [functions])

  return (
    <div ref={innerRef}>
      {/* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex -- dummy element for focus management. */}
      <div ref={dummyFocusRef} tabIndex={-1} />
      {children}
    </div>
  )
})
