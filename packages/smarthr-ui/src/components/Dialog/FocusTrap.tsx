import {
  type PropsWithChildren,
  type RefObject,
  forwardRef,
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

const DUMMY_FOCUS_CLASSNAME = 'smarthr-ui-Dialog-dummyFocus'
const DUMMY_FOCUS_SELECTOR = `.${DUMMY_FOCUS_CLASSNAME}[tabIndex]`

export const FocusTrap = forwardRef<FocusTrapRef, Props>(({ firstFocusTarget, children }, ref) => {
  const innerRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<Element | null>(null)

  const functions = useMemo(() => {
    const findDummyFocus = () => innerRef.current?.querySelector<HTMLElement>(DUMMY_FOCUS_SELECTOR)

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
        if (currentFocused === firstTabbable || document.activeElement === findDummyFocus()) {
          e.preventDefault()
          lastTabbable.focus()
        }
      } else if (currentFocused === lastTabbable) {
        e.preventDefault()
        firstTabbable.focus()
      }
    }

    const focus = () => {
      ;(firstFocusTarget?.current || findDummyFocus())?.focus()
    }

    return {
      callbackRef: (node: HTMLDivElement | null) => {
        // TODO: useMergeRefsが実装されたらcallbackRefから代入処理を取り除く
        innerRef.current = node

        if (!triggerRef.current) {
          // FocusTrap がマウントされた時点のフォーカス要素を保存
          triggerRef.current = document.activeElement
        }

        if (node) {
          // カスケード更新（usePortalのportalRoot生成等）が完了し、DOMに接続された後にフォーカスするため
          // 次の描画フレームまで遅延させる
          requestAnimationFrame(focus)

          window.addEventListener('keydown', handleKeyDown)
        } else {
          window.removeEventListener('keydown', handleKeyDown)

          // フォーカストラップ終了時にトリガにフォーカスを戻す
          const trigger = triggerRef.current
          triggerRef.current = null

          if (trigger instanceof HTMLElement) {
            trigger.focus()
          }
        }
      },
      focus,
    }
  }, [firstFocusTarget])

  useImperativeHandle(ref, () => functions as { focus: () => void }, [functions])

  return (
    <div ref={functions.callbackRef}>
      {!firstFocusTarget && (
        /* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex -- dummy element for focus management. */
        <div tabIndex={-1} className={DUMMY_FOCUS_CLASSNAME} />
      )}
      {children}
    </div>
  )
})
