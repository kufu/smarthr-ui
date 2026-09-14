'use client'

import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useAnimationFrame } from '../../hooks/client/useAnimationFrame'
import { useMergeRefs } from '../../hooks/client/useMergeRefs'
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
  base: [
    'smarthr-ui-Dropdown-content',
    'shr-absolute shr-z-overlap-base shr-overflow-y-auto shr-break-words shr-rounded-m shr-bg-white shr-shadow-layer-3',
    'forced-colors:shr-outline forced-colors:shr-outline-1',
    'shr-invisible data-[dropdown-active]:shr-visible',
  ],
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

  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

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

  const { triggerElementRef, rootTriggerRef, handleDelegateClickCloser } =
    useContext(DropdownContext)

  const focusFrame = useAnimationFrame()

  const latest = useLatest({
    triggerElementRef,
    rootTriggerRef,
    handleDelegateClickCloser,
    isActive,
    focusFrame,
  })

  const callbackRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) {
        return
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (!latest.triggerElementRef.current || !latest.rootTriggerRef?.current) {
            return
          }

          const tabbablesInContent = tabbable(node)

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

          for (const inner of tabbable(node)) {
            if (inner === e.target) {
              // close the dropdown when an element that is included in dropdown content is focused and Esc key is pressed
              latest.handleDelegateClickCloser()

              break
            }
          }
        }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    },
    [latest],
  )

  // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
  // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
  const mergedRef = useMergeRefs(wrapperRef, callbackRef)

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

      if (!latest.isActive) {
        setIsActive(true)

        // HINT: このコンポーネントは Dropdown が開かれた時のみマウントされるが、マウント直後は
        // 位置計算が完了していないためコンテンツが誤った位置にちらつくのを防ぐために
        // shr-invisible (visibility: hidden) でレンダリングされ、visibility: hidden の要素は
        // フォーカスを受け付けない。setIsActive(true) の直後に focus() を呼んでも DOM がまだ
        // 更新されておらず無効になるため、requestAnimationFrame で次の描画フレームまで遅延させる
        latest.focusFrame.request(() => focusTargetRef.current?.focus())
      }
    }

    return () => latest.focusFrame.cancel()
  }, [triggerRect, latest])

  return (
    <div
      {...rest}
      ref={mergedRef}
      className={actualClassName}
      style={style}
      data-dropdown-active={isActive || undefined}
    >
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
