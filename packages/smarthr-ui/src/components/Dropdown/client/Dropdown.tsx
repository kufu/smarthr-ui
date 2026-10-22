'use client'

import {
  type FC,
  type MouseEvent,
  type PropsWithChildren,
  type KeyboardEvent as ReactKeyboardEvent,
  createContext,
  useId,
  useMemo,
  useState,
} from 'react'

import { useAnimationFrame } from '../../../hooks/client/useAnimationFrame'
import { useLayoutEffectRef } from '../../../hooks/client/useLayoutEffectRef'
import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useTheme } from '../../../hooks/client/useTheme'
import { useLatest } from '../../../hooks/useLatest'
import { findDelegateTarget } from '../../../libs/delegate'
import { tabbable } from '../../../libs/tabbable'
import { isChildPortal } from '../../Portal'
import { DROPDOWN_CLOSER_CLASS_NAME } from '../DropdownCloser'

import { DROPDOWN_CONTENT_CLASS_NAME, DUMMY_FOCUS_CONTENT_CLASSNAME } from './constants'
import { INITIAL_CONTENT_STYLES, generateContentStyle } from './getContentBoxStyle'

type Props = PropsWithChildren<{
  onOpen?: () => void
  onClose?: () => void
}>

type DropdownContextType = {
  active: boolean
  contentStyles: typeof INITIAL_CONTENT_STYLES
  triggerLayoutEffectRef: (node: HTMLElement | null) => void
  contentCallbackRef: (node: HTMLElement | null) => void
  handleDelegateClickTrigger: (e: MouseEvent<HTMLElement>) => void
  handleDelegateClickContent: (e: MouseEvent<HTMLElement>) => void
  handleDelegateKeyDownContent: (e: ReactKeyboardEvent<HTMLElement>) => void
  contentId: string
}

const KEY_ESCAPE = /^Esc(ape)?$/
const NOOP = () => null

export const DropdownContext = createContext<DropdownContextType>({
  active: false,
  contentStyles: INITIAL_CONTENT_STYLES,
  triggerLayoutEffectRef: NOOP,
  contentCallbackRef: NOOP,
  handleDelegateClickTrigger: NOOP,
  handleDelegateClickContent: NOOP,
  handleDelegateKeyDownContent: NOOP,
  contentId: '',
})

export const Dropdown: FC<Props> = ({ onOpen, onClose, children }) => {
  const theme = useTheme()
  const [active, setActive] = useState(false)
  const [contentStyles, setContentStyles] = useState(INITIAL_CONTENT_STYLES)

  const contentId = useId()

  const openFrame = useAnimationFrame()
  const closeFrame = useAnimationFrame()
  const focusFrame = useAnimationFrame()

  const latest = useLatest({
    active,
    onOpen,
    onClose,
    openFrame,
    closeFrame,
    contentId,
    theme,
    focusFrame,
    contentStyles,
  })

  const functions = useMemo(() => {
    let trigger: HTMLElement | null = null
    let triggerButton: HTMLButtonElement | null | undefined = null
    let content: HTMLElement | null = null
    let dummyFocusContent: HTMLElement | null | undefined = null

    const updateContentStyles = () => {
      if (content && triggerButton) {
        setContentStyles(
          generateContentStyle(
            latest.contentStyles,
            triggerButton,
            content,
            latest.theme.spacingByChar(0.5),
          ),
        )
      }
    }

    const actualClose = () => {
      if (latest.onClose) {
        latest.closeFrame.request(() => latest.onClose?.())
      }
    }
    const handleDelegateClickCloser = () => {
      setActive(false)
      actualClose()

      // return focus to the Trigger
      if (trigger) {
        tabbable(trigger)[0]?.focus()
      }
    }

    return {
      updateContentStyles,
      getContent: () => content,
      triggerCallbackRef: (node: HTMLElement | null) => {
        trigger = node
        triggerButton = node?.querySelector<HTMLButtonElement>('button')

        return () => {
          trigger = null
          triggerButton = null
          latest.openFrame.cancel()
          latest.closeFrame.cancel()
        }
      },
      contentCallbackRef: (node: HTMLElement | null) => {
        content = node

        if (!node) {
          return
        }

        dummyFocusContent = node?.querySelector<HTMLElement>(`.${DUMMY_FOCUS_CONTENT_CLASSNAME}`)

        updateContentStyles()
        node.setAttribute('data-dropdown-mounted', 'true')

        // HINT: このコンポーネントは Dropdown が開かれた時のみマウントされるが、マウント直後は
        // 位置計算が完了していないためコンテンツが誤った位置にちらつくのを防ぐために
        // shr-invisible (visibility: hidden) でレンダリングされ、visibility: hidden の要素は
        // フォーカスを受け付けない。data-dropdown-mounted の設定直後直後に focus() を呼んでも DOM がまだ
        // 更新されておらず無効になるため、requestAnimationFrame で次の描画フレームまで遅延させる
        latest.focusFrame.request(() => {
          node.querySelector<HTMLElement>(`.${DUMMY_FOCUS_CONTENT_CLASSNAME}`)?.focus()
        })

        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (!trigger) {
              return
            }

            const tabbablesInContent = tabbable(node)

            if (tabbablesInContent.length === 0) {
              return
            }

            const target = tabbable(trigger).at(-1)
            const firstTabbable = tabbablesInContent[0]

            if (e.target === target) {
              if (e.shiftKey) {
                // move focus previous of the Trigger
                return
              }

              // focus a first tabbable element in the dropdown content
              e.preventDefault()
              firstTabbable.focus()

              return
            } else if (e.shiftKey) {
              if (e.target === firstTabbable || e.target === dummyFocusContent) {
                // focus the Trigger
                e.preventDefault()
                target!.focus()
                handleDelegateClickCloser()
              }
            } else if (e.target === tabbablesInContent.at(-1)) {
              // focus the Trigger
              e.preventDefault()
              target!.focus()
              handleDelegateClickCloser()
            }
          }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
          latest.focusFrame.cancel()
          window.removeEventListener('keydown', handleKeyDown)

          content = null
          dummyFocusContent = null
        }
      },
      actualClose,
      handleDelegateClickTrigger: () => {
        // 引き金となる要素が disabled な場合、処理を差し込む必要がない
        if (
          !triggerButton ||
          triggerButton.disabled ||
          triggerButton.getAttribute('aria-disabled') === 'true'
        ) {
          return
        } else if (latest.active) {
          setActive(false)
          actualClose()
        } else {
          setActive(true)

          if (latest.onOpen) {
            latest.openFrame.request(() => latest.onOpen?.())
          }
        }
      },
      handleDelegateClickContent: (e: MouseEvent<HTMLElement>) => {
        const closer = findDelegateTarget<HTMLElement>(e, `.${DROPDOWN_CLOSER_CLASS_NAME}`)

        // HINT: Dropdownがネストしている場合、もっとも近いDropdownだけを閉じる
        if (closer?.closest(`.${DROPDOWN_CONTENT_CLASS_NAME}`) === e.currentTarget) {
          handleDelegateClickCloser()
        } else if (
          // HINT: DropdownContent 内のフォーカスできない要素をクリックすると、フォーカスは body に移る。
          // これが Dialog > Dropdown の構造で発生すると 、body が Esc キーのイベントを受けてしまい、Dropdown だけでなく下にある Dialog も閉じてしまう。
          // これを防ぐため、DropdownContent クリック時は Dropdown 内のダミー要素にフォーカスをする
          e.target instanceof Node &&
          e.currentTarget.contains(e.target) &&
          (!document.activeElement || document.activeElement === document.body)
        ) {
          dummyFocusContent?.focus()
        }
      },
      // HINT: Dialog > Dropdown の構造になっている場合、Dialog よりも先に Dropdown が Esc キーを受け取って伝播を止める必要があるので、DropdownContent に keydown イベントを設定する
      handleDelegateKeyDownContent: (e: ReactKeyboardEvent<HTMLElement>) => {
        if (
          KEY_ESCAPE.test(e.key) &&
          e.target instanceof Node &&
          e.currentTarget.contains(e.target)
        ) {
          e.stopPropagation()
          handleDelegateClickCloser()
        }
      },
    }
  }, [latest])

  const baseTriggerLayoutEffectRef = useLayoutEffectRef(
    (node: HTMLElement | null) => {
      if (!node) return

      // apply ARIA to all focusable elements in trigger
      const activeStr = active.toString()
      tabbable(node, { shouldIgnoreVisibility: true }).forEach((trigger) => {
        trigger.setAttribute('aria-expanded', activeStr)
        trigger.setAttribute('aria-controls', latest.contentId)
      })

      if (!active) return

      const handleClickBody = (e: any) => {
        if (!active || !node) return

        // HINT: クリックされた要素がクリック処理中にDOMから取り除かれる場合がある(例: WarekiPickerのYearPickerで年を選択した場合)
        // e.targetから親要素を辿るとポータル外と誤判定してしまうため、イベント発生時点の経路であるcomposedPathで判定する
        const path: EventTarget[] = e.composedPath()

        // ignore events from events within DropdownTrigger and DropdownContent
        if (path.includes(node)) return

        const content = functions.getContent()

        if (
          !path.some(
            (target) =>
              (target instanceof HTMLElement || target instanceof SVGElement) &&
              isChildPortal(target, content),
          )
        ) {
          setActive(false)
          functions.actualClose()
        }
      }

      const listenerOption = { passive: true }

      document.body.addEventListener('click', handleClickBody, false)
      window.addEventListener('scroll', functions.updateContentStyles, listenerOption)
      window.addEventListener('resize', functions.updateContentStyles, listenerOption)

      return () => {
        document.body.removeEventListener('click', handleClickBody, false)
        window.removeEventListener('scroll', functions.updateContentStyles)
        window.removeEventListener('resize', functions.updateContentStyles)
      }
    },
    [active, functions, latest],
  )

  const triggerLayoutEffectRef = useMergeRefs(
    functions.triggerCallbackRef,
    baseTriggerLayoutEffectRef,
  )

  return (
    <DropdownContext.Provider
      value={{
        active,
        contentStyles,
        triggerLayoutEffectRef,
        contentCallbackRef: functions.contentCallbackRef,
        handleDelegateClickTrigger: functions.handleDelegateClickTrigger,
        handleDelegateClickContent: functions.handleDelegateClickContent,
        handleDelegateKeyDownContent: functions.handleDelegateKeyDownContent,
        contentId,
      }}
    >
      {children}
    </DropdownContext.Provider>
  )
}
