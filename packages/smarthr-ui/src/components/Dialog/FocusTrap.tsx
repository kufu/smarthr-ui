import {
  type PropsWithChildren,
  type RefObject,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import { useMergeRefs } from '../../hooks/useMergeRefs'
import { tabbable } from '../../libs/tabbable'

type Props = PropsWithChildren<{
  firstFocusTarget?: RefObject<HTMLElement>
}>

export type FocusTrapRef = {
  focus: () => void
}

const DUMMY_FOCUS_CLASSNAME = 'smarthr-ui-Dialog-dummyFocus'
const DUMMY_FOCUS_SELECTOR = `.${DUMMY_FOCUS_CLASSNAME}[tabIndex]`

export const FocusTrap = forwardRef<FocusTrapRef, Props>(({ firstFocusTarget, children }, ref) => {
  // TODO: innerRefを削除して、functionsのuseMemoの中にletで変数としてnodeの参照を持つことを検討
  const innerRef = useRef<HTMLDivElement | null>(null)

  const functions = useMemo(() => {
    const findDummyFocus = () => innerRef.current?.querySelector<HTMLElement>(DUMMY_FOCUS_SELECTOR)

    const focus = () => {
      ;(firstFocusTarget?.current || findDummyFocus())?.focus()
    }

    return {
      callbackRef: (node: HTMLDivElement | null) => {
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
          if (e.key !== 'Tab' || e.isComposing) {
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

        // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
        // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
        return () => {
          cancelAnimationFrame(rAFId)
          window.removeEventListener('keydown', handleKeyDown)

          if (triggerElement instanceof HTMLElement) {
            triggerElement.focus()
          }
        }
      },
      focus,
    }
  }, [firstFocusTarget])

  // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
  // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
  const mergedRef = useMergeRefs(innerRef, functions.callbackRef)

  useImperativeHandle(ref, () => functions as { focus: () => void }, [functions])

  return (
    <div ref={mergedRef}>
      {!firstFocusTarget && (
        /* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex -- dummy element for focus management. */
        <div tabIndex={-1} className={DUMMY_FOCUS_CLASSNAME} />
      )}
      {children}
    </div>
  )
})
