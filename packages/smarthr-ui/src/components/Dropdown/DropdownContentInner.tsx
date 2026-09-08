'use client'

import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useTheme } from '../../hooks/client/useTheme'
import { useLatest } from '../../hooks/useLatest'
import { tabbable } from '../../libs/tabbable'

import { DropdownContext } from './Dropdown'
import { DropdownCloser } from './DropdownCloser'
import {
  type ContentBoxStyle,
  type Rect,
  getContentBoxStyle,
  getFirstTabbable,
} from './dropdownHelper'

const KEY_ESCAPE = /^Esc(ape)?$/

const classNameGenerator = tv({
  base: 'smarthr-ui-Dropdown-content shr-absolute shr-z-overlap-base shr-overflow-y-auto shr-break-words shr-rounded-m shr-bg-white shr-shadow-layer-3 forced-colors:shr-outline forced-colors:shr-outline-1',
  variants: {
    isActive: {
      true: 'shr-visible',
      false: 'shr-invisible',
    },
  },
})

type BaseProps = PropsWithChildren<{
  triggerRect: Rect
  controllable: boolean
}>

export type ElementProps = Omit<ComponentProps<'div'>, keyof BaseProps>
type Props = BaseProps & ElementProps

type DropdownContentInnerContextType = {
  maxHeight: string
}

export const DropdownContentInnerContext = createContext<DropdownContentInnerContextType>({
  maxHeight: '',
})

export const DropdownContentInner: FC<Props> = ({
  triggerRect,
  children,
  className,
  controllable,
  ...rest
}) => {
  const theme = useTheme()
  const [isActive, setIsActive] = useState(false)
  const [contentBox, setContentBox] = useState<ContentBoxStyle>({
    top: 'auto',
    maxHeight: '',
  })
  const wrapperRef = useRef<HTMLDivElement>(null)
  const focusTargetRef = useRef<HTMLDivElement>(null)

  const actualClassName = useMemo(
    () => classNameGenerator({ isActive, className }),
    [isActive, className],
  )

  const style = (() => {
    const defaultMargin = theme.spacingByChar(0.5)
    const leftMargin =
      contentBox.left === undefined ? defaultMargin : `max(${contentBox.left}, 0px)`
    const rightMargin =
      contentBox.right === undefined ? defaultMargin : `max(${contentBox.right}, 0px)`
    const maxWidthStyle = `calc(100% - ${leftMargin} - ${rightMargin})`

    return {
      insetBlockStart: contentBox.top,
      insetInlineStart: contentBox.left || undefined,
      insetInlineEnd: contentBox.right || undefined,
      maxWidth: maxWidthStyle,
    }
  })()

  useEffect(() => {
    if (wrapperRef.current) {
      setContentBox(
        getContentBoxStyle(
          triggerRect,
          {
            width: wrapperRef.current.offsetWidth,
            height: wrapperRef.current.offsetHeight,
          },
          {
            width: document.body.clientWidth,
            height: innerHeight,
          },
          {
            top: scrollY,
            left: scrollX,
          },
        ),
      )
      setIsActive(true)
    }
  }, [triggerRect])

  // setIsActive(true) と同じ useEffect 内で直接 focus() を呼ぶことはできない。
  // このコンポーネントは Dropdown が開かれた時のみマウントされるが、マウント直後は
  // 位置計算が完了していないためコンテンツが誤った位置にちらつくのを防ぐために
  // shr-invisible (visibility: hidden) でレンダリングされる。
  // ちらつき防止には実寸法を保持したまま視覚的に隠せる visibility: hidden が唯一の手段となる。
  // visibility: hidden の要素はフォーカスを受け付けないため、setIsActive(true) の直後に
  // focus() を呼んでも DOM がまだ更新されておらず無効になる。
  //
  // useEffect([isActive]) であれば、isActive=true になった後の render commit 後に
  // 必ず実行されることが保証されるため、この実装が最も信頼性が高い。
  useEffect(() => {
    if (isActive) {
      focusTargetRef.current?.focus()
    }
  }, [isActive])

  const { triggerElementRef, rootTriggerRef, handleDelegateClickCloser } =
    useContext(DropdownContext)

  const latest = useLatest({
    triggerElementRef,
    rootTriggerRef,
    handleDelegateClickCloser,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (
          !wrapperRef.current ||
          !latest.triggerElementRef.current ||
          !latest.rootTriggerRef?.current
        ) {
          return
        }

        const tabbablesInContent = tabbable(wrapperRef.current)

        if (tabbablesInContent.length === 0) {
          return
        }

        const trigger = tabbable(latest.triggerElementRef.current).at(-1)
        const firstTabbable = tabbablesInContent[0]

        if (e.target === trigger) {
          if (e.shiftKey) {
            // move focus previous of the Trigger
            return
          }

          // focus a first tabbable element in the dropdown content
          e.preventDefault()
          firstTabbable.focus()

          return
        } else if (e.shiftKey) {
          if (e.target === firstTabbable || e.target === focusTargetRef.current) {
            // focus the Trigger
            e.preventDefault()
            trigger!.focus()
            latest.handleDelegateClickCloser()
          }
        } else if (e.target === tabbablesInContent.at(-1)) {
          // move focus next of the Trigger
          const rootTrigger = tabbable(latest.rootTriggerRef.current).at(-1)

          if (rootTrigger) {
            rootTrigger.focus()
            latest.handleDelegateClickCloser()
          }
        }
      } else if (KEY_ESCAPE.test(e.key)) {
        if (e.target && e.target === focusTargetRef.current) {
          latest.handleDelegateClickCloser()

          return
        }

        const trigger = getFirstTabbable(latest.triggerElementRef)

        if (trigger && e.target === trigger) {
          // close the dropdown when the Trigger is focused and Esc key is pressed
          latest.handleDelegateClickCloser()

          return
        }

        if (wrapperRef.current) {
          for (const inner of tabbable(wrapperRef.current)) {
            if (inner === e.target) {
              // close the dropdown when an element that is included in dropdown content is focused and Esc key is pressed
              latest.handleDelegateClickCloser()

              break
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [latest])

  return (
    <div {...rest} ref={wrapperRef} className={actualClassName} style={style}>
      {/* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex -- dummy element for focus management. */}
      <div ref={focusTargetRef} tabIndex={-1} />
      {controllable ? (
        <div
          style={{
            maxHeight: contentBox.maxHeight || undefined,
          }}
        >
          {children}
        </div>
      ) : (
        <DropdownContentInnerContext.Provider value={{ maxHeight: contentBox.maxHeight }}>
          <DropdownCloser>{children}</DropdownCloser>
        </DropdownContentInnerContext.Provider>
      )}
    </div>
  )
}
