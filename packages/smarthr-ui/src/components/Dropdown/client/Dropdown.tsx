'use client'

import {
  type FC,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
  createContext,
  useId,
  useMemo,
  useState,
} from 'react'

import { useAnimationFrame } from '../../../hooks/client/useAnimationFrame'
import { useCallbackRefCleanupForReact18 } from '../../../hooks/client/useCallbackRefCleanupForReact18'
import { useLayoutEffectRef } from '../../../hooks/client/useLayoutEffectRef'
import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { usePortal } from '../../../hooks/client/usePortal'
import { useTheme } from '../../../hooks/client/useTheme'
import { useLatest } from '../../../hooks/useLatest'
import { findDelegateTarget } from '../../../libs/delegate'
import { tabbable } from '../../../libs/tabbable'
import { DROPDOWN_CLOSER_CLASS_NAME } from '../DropdownCloser'

import { DROPDOWN_CONTENT_CLASS_NAME, DUMMY_FOCUS_CONTENT_CLASSNAME } from './constants'
import { getContentBoxStyle } from './getContentBoxStyle'

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
  handleDelegateClickContentCloser: (e: MouseEvent<HTMLElement>) => void
  DropdownContentRoot: FC<{ children: ReactNode }>
}

const KEY_ESCAPE = /^Esc(ape)?$/
const NOOP = () => null
const INITIAL_CONTENT_STYLES: {
  wrapper: {
    insetBlockStart: string
    insetInlineStart?: string
    insetInlineEnd?: string
    maxWidth: string
  }
  body: {
    maxHeight?: string
  }
} = { wrapper: { insetBlockStart: 'auto', maxWidth: '' }, body: {} }

export const DropdownContext = createContext<DropdownContextType>({
  active: false,
  contentStyles: INITIAL_CONTENT_STYLES,
  triggerLayoutEffectRef: NOOP,
  contentCallbackRef: NOOP,
  handleDelegateClickTrigger: NOOP,
  handleDelegateClickContentCloser: NOOP,
  DropdownContentRoot: NOOP,
})

export const Dropdown: FC<Props> = ({ onOpen, onClose, children }) => {
  const theme = useTheme()
  const [active, setActive] = useState(false)
  const [contentStyles, setContentStyles] = useState(INITIAL_CONTENT_STYLES)

  const contentId = useId()
  const { createPortal, isChildPortal, PortalParentProvider } = usePortal({
    rootId: contentId,
  })

  const openFrame = useAnimationFrame()
  const closeFrame = useAnimationFrame()
  const focusFrame = useAnimationFrame()

  const latest = useLatest({
    active,
    isChildPortal,
    onOpen,
    onClose,
    createPortal,
    openFrame,
    closeFrame,
    contentId,
    theme,
    focusFrame,
  })

  const functions = useMemo(() => {
    let trigger: HTMLElement | null = null
    let triggerButton: HTMLButtonElement | null | undefined = null
    let content: HTMLElement | null = null
    let dummyFocusContent: HTMLElement | null | undefined = null

    // This is the root container of a dropdown content located in outside the DOM tree
    const DropdownContentRoot: FC<{ children: ReactNode }> = (props) =>
      latest.active ? latest.createPortal(props.children) : null
    DropdownContentRoot.displayName = 'DropdownContentRoot'

    const updateContentStyles = () => {
      if (content && triggerButton) {
        const contentBox = getContentBoxStyle(
          triggerButton.getBoundingClientRect(),
          {
            width: content.offsetWidth,
            height: content.offsetHeight,
          },
          {
            width: document.body.clientWidth,
            height: innerHeight,
          },
          {
            top: scrollY,
            left: scrollX,
          },
        )
        const defaultMargin = latest.theme.spacingByChar(0.5)
        const leftMargin =
          contentBox.left === undefined ? defaultMargin : `max(${contentBox.left}, 0px)`
        const rightMargin =
          contentBox.right === undefined ? defaultMargin : `max(${contentBox.right}, 0px)`
        const maxWidthStyle = `calc(100% - ${leftMargin} - ${rightMargin})`
        const wrapper = {
          insetBlockStart: contentBox.top,
          insetInlineStart: contentBox.left || undefined,
          insetInlineEnd: contentBox.right || undefined,
          maxWidth: maxWidthStyle,
        }
        const body = {
          maxHeight: contentBox.maxHeight || undefined,
        }

        setContentStyles((current) => {
          if (
            current.wrapper.insetBlockStart === wrapper.insetBlockStart &&
            current.wrapper.insetInlineStart === wrapper.insetInlineStart &&
            current.wrapper.insetInlineEnd === wrapper.insetInlineEnd &&
            current.wrapper.maxWidth === wrapper.maxWidth &&
            current.body.maxHeight === body.maxHeight
          ) {
            return current
          }

          return {
            wrapper,
            body,
          }
        })
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
      DropdownContentRoot,
      updateContentStyles,
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
      baseContentCallbackRef: (node: HTMLElement | null) => {
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
          } else if (KEY_ESCAPE.test(e.key)) {
            if (e.target && e.target === dummyFocusContent) {
              handleDelegateClickCloser()

              return
            }

            const target = trigger ? tabbable(trigger)[0] : undefined

            if (target && e.target === target) {
              // close the dropdown when the Trigger is focused and Esc key is pressed
              handleDelegateClickCloser()

              return
            }

            for (const inner of tabbable(node)) {
              if (inner === e.target) {
                // close the dropdown when an element that is included in dropdown content is focused and Esc key is pressed
                handleDelegateClickCloser()

                break
              }
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
      handleDelegateClickContentCloser: (e: MouseEvent<HTMLElement>) => {
        const closer = findDelegateTarget<HTMLElement>(e, `.${DROPDOWN_CLOSER_CLASS_NAME}`)

        // HINT: Dropdownがネストしている場合、もっとも近いDropdownだけを閉じる
        if (closer?.closest(`.${DROPDOWN_CONTENT_CLASS_NAME}`) === e.currentTarget) {
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
        if (!latest.active || !node) {
          return
        }

        // ignore events from events within DropdownTrigger and DropdownContent
        const isClickedInTrigger = e.composedPath().includes(node)

        if (!isClickedInTrigger && !latest.isChildPortal(e.target)) {
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

  const contentCallbackRef = useCallbackRefCleanupForReact18(functions.baseContentCallbackRef)

  return (
    <PortalParentProvider>
      <DropdownContext.Provider
        value={{
          active,
          contentStyles,
          triggerLayoutEffectRef,
          contentCallbackRef,
          handleDelegateClickTrigger: functions.handleDelegateClickTrigger,
          handleDelegateClickContentCloser: functions.handleDelegateClickContentCloser,
          DropdownContentRoot: functions.DropdownContentRoot,
        }}
      >
        {children}
      </DropdownContext.Provider>
    </PortalParentProvider>
  )
}
