'use client'

import { type FC, type Ref, type RefObject, useImperativeHandle, useMemo } from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { tabbable } from '../../../libs/tabbable'

import type { ExtendElementPropsWithoutRef } from '../../../types'

type Props = ExtendElementPropsWithoutRef<
  'div',
  {
    firstFocusTarget?: RefObject<HTMLElement>
    /**
     * Tab を内側で循環させる。既定は true。
     * false でも開いたときのフォーカス移動は行い、閉じたときのトリガへの復帰はフォーカスが内側か body にあるときだけ行う
     */
    trapFocus?: boolean
    /**
     * 開いたとき、ref の focus()、閉じたときのトリガへの復帰でのフォーカス移動で祖先をスクロールさせない。
     * 復帰したトリガが :focus-visible になるキーボード操作では、トリガが見える位置までだけスクロールする
     */
    preventScroll?: boolean
    ref?: Ref<{ focus: () => void }>
  }
>

const DUMMY_FOCUS_CLASSNAME = 'smarthr-ui-Dialog-dummyFocus'
const DUMMY_FOCUS_SELECTOR = `.${DUMMY_FOCUS_CLASSNAME}[tabIndex]`

export const FocusTrap: FC<Props> = ({
  firstFocusTarget,
  trapFocus = true,
  preventScroll,
  ref,
  children,
  ...rest
}) => {
  const latest = useLatest({ trapFocus, preventScroll })

  const functions = useMemo(() => {
    let inner: HTMLElement | null = null
    const findDummyFocus = () => inner?.querySelector<HTMLElement>(DUMMY_FOCUS_SELECTOR)

    const focus = () => {
      ;(firstFocusTarget?.current || findDummyFocus())?.focus({
        preventScroll: latest.preventScroll,
      })
    }

    return {
      callbackRef: (node: HTMLElement | null) => {
        inner = node

        if (!node) {
          return
        }

        // FocusTrap がマウントされた時点のフォーカス要素を保存
        const triggerElement = document.activeElement

        const rAFId = requestAnimationFrame(focus)

        const handleKeyDown = (e: KeyboardEvent) => {
          // IME 変換中の Tab は変換候補の選択に使われるため、フォーカストラップの対象外にする。
          // ここで preventDefault してしまうと、Dialog 内で日本語入力中に Tab を押しても
          // 変換候補が確定されず、未確定文字列がそのまま入力されてしまう。
          if (!latest.trapFocus || e.key !== 'Tab' || e.isComposing) {
            return
          }

          const tabbables = tabbable(node).filter((elm) => elm.tabIndex >= 0)

          if (tabbables.length === 0) {
            return
          }

          const firstTabbable = tabbables[0]
          const lastTabbable = tabbables[tabbables.length - 1]
          const currentFocused = tabbables.find((elm) => elm === e.target)

          if (e.shiftKey) {
            if (currentFocused === firstTabbable || document.activeElement === findDummyFocus()) {
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
          inner = null
          cancelAnimationFrame(rAFId)
          window.removeEventListener('keydown', handleKeyDown)

          const { activeElement } = document

          // フォーカスがどこにあっても戻す案は、Tab を閉じ込めないときに背後で操作している要素からフォーカスを奪うため採らない
          if (
            triggerElement instanceof HTMLElement &&
            (latest.trapFocus || activeElement === document.body || node.contains(activeElement))
          ) {
            triggerElement.focus({ preventScroll: latest.preventScroll })

            // 常にスクロールしない案は、キーボードで閉じたときに画面外のトリガにあるフォーカスが見えなくなるため採らない
            if (latest.preventScroll && triggerElement.matches(':focus-visible')) {
              triggerElement.scrollIntoView({ block: 'nearest' })
            }
          }
        }
      },
      focus,
    }
  }, [firstFocusTarget, latest])

  useImperativeHandle(ref, () => functions as { focus: () => void }, [functions])

  return (
    <div {...rest} ref={functions.callbackRef}>
      {!firstFocusTarget && (
        /* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex -- dummy element for focus management. */
        <div tabIndex={-1} className={DUMMY_FOCUS_CLASSNAME} />
      )}
      {children}
    </div>
  )
}
