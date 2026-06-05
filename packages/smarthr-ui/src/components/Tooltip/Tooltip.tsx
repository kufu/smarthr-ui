'use client'

import {
  type BaseSyntheticEvent,
  type ComponentProps,
  type FC,
  type FocusEvent,
  type PointerEvent,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  type TouchEvent,
  cloneElement,
  memo,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { useEnhancedEffect } from '../../hooks/useEnhancedEffect'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { TooltipPortal } from './TooltipPortal'

const subscribeFullscreenChange = (callback: () => void) => {
  window.addEventListener('fullscreenchange', callback)

  return () => {
    window.removeEventListener('fullscreenchange', callback)
  }
}
const getFullscreenElement = () => document.fullscreenElement
const getFullscreenElementOnSSR = () => null

type AbstractProps = PropsWithChildren<{
  /** ツールチップ内に表示するメッセージ */
  message: ReactNode
  /** ツールチップの種類。`label` の場合は children の要素に `aria-labelledby` を付与しアクセシブルネームとして機能する。`description`（デフォルト）の場合は `aria-describedby` を付与し補足説明として機能する */
  type?: 'label' | 'description'
  /** ツールチップを表示する対象のタイプ。アイコンの場合は `icon` を指定する */
  triggerType?: 'icon' | 'text'
  /** `true` のとき、ツールチップを表示する対象が省略されている場合のみツールチップ表示を有効にする */
  ellipsisOnly?: boolean
  /** ツールチップを表示する対象の tabIndex 値 */
  tabIndex?: number
  /** `type` が `description` の場合に `aria-describedby` を付与する対象。children が focusable な場合は常に children に付与されるため無視される */
  ariaDescribedbyTarget?: 'wrapper' | 'inner'
}>
type Props = AbstractProps &
  Omit<ComponentProps<'span'>, keyof AbstractProps | 'aria-describedby' | 'aria-labelledby'>

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Tooltip',
    'shr-relative',
    'shr-inline-block shr-max-w-full shr-align-bottom',
    'focus-visible:shr-focus-indicator--outer',
  ],
  variants: {
    isIcon: {
      true: 'shr-leading-[0]',
    },
  },
})

export const Tooltip: FC<Props> = ({
  message,
  children,
  type = 'description',
  triggerType,
  ellipsisOnly,
  tabIndex,
  ariaDescribedbyTarget = 'wrapper',
  className,
  onPointerEnter,
  onPointerLeave,
  onTouchStart,
  onTouchEnd,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [portalRoot, setPortalRoot] = useState<Element | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const messageId = useId()
  const fullscreenElement = useSyncExternalStore(
    subscribeFullscreenChange,
    getFullscreenElement,
    getFullscreenElementOnSSR,
  )

  const [isFocusableChild, setIsFocusableChild] = useState(false)
  const [actualTabIndex, setActualTabIndex] = useState<number | undefined>(tabIndex ?? 0)

  useEnhancedEffect(() => {
    setPortalRoot(fullscreenElement ?? document.body)
  }, [fullscreenElement])

  useEnhancedEffect(() => {
    const childElement = ref.current?.querySelector<HTMLElement>(
      ':scope > :not(.smarthr-ui-VisuallyHiddenText)',
    )

    const focusable =
      !!childElement &&
      childElement.matches('a[href], button, input, select, textarea, [tabindex]') &&
      !childElement.matches('[tabindex="-1"]')

    setIsFocusableChild(focusable)
    setActualTabIndex(tabIndex !== undefined ? tabIndex : focusable ? undefined : 0)
  }, [tabIndex])

  const toShowAction = useCallback(
    (e: BaseSyntheticEvent) => {
      // Tooltipのtriggerの他の要素(Dropwdown menu buttonで開いたmenu contentとか)に移動されたらtooltipを表示しない
      if (!ref.current?.contains(e.target)) {
        return
      }

      if (ellipsisOnly) {
        const outerWidth = parseInt(
          window
            .getComputedStyle(ref.current.parentNode! as HTMLElement, null)
            .width.match(/\d+/)![0],
          10,
        )

        if (outerWidth < 0 || outerWidth > ref.current.clientWidth) {
          return
        }
      }

      setRect(ref.current.getBoundingClientRect())
      setIsVisible(true)
    },
    [ellipsisOnly],
  )
  const onDelegatePointerEnter = useMemo(
    () =>
      onPointerEnter
        ? (e: PointerEvent<HTMLSpanElement>) => {
            onPointerEnter(e)
            toShowAction(e)
          }
        : toShowAction,
    [onPointerEnter, toShowAction],
  )
  const onDelegateTouchStart = useMemo(
    () =>
      onTouchStart
        ? (e: TouchEvent<HTMLSpanElement>) => {
            onTouchStart(e)
            toShowAction(e)
          }
        : toShowAction,
    [onTouchStart, toShowAction],
  )
  const onDelegateFocus = useMemo(
    () =>
      onFocus
        ? (e: FocusEvent<HTMLSpanElement>) => {
            onFocus(e)
            toShowAction(e)
          }
        : toShowAction,
    [onFocus, toShowAction],
  )

  const toCloseAction = useCallback(() => setIsVisible(false), [])
  const onDelegatePointerLeave = useMemo(
    () =>
      onPointerLeave
        ? (e: PointerEvent<HTMLSpanElement>) => {
            onPointerLeave(e)
            toCloseAction()
          }
        : toCloseAction,
    [onPointerLeave, toCloseAction],
  )
  const onDelegateTouchEnd = useMemo(
    () =>
      onTouchEnd
        ? (e: TouchEvent<HTMLSpanElement>) => {
            onTouchEnd(e)
            toCloseAction()
          }
        : toCloseAction,
    [onTouchEnd, toCloseAction],
  )
  const onDelegateBlur = useMemo(
    () =>
      onBlur
        ? (e: FocusEvent<HTMLSpanElement>) => {
            onBlur(e)
            toCloseAction()
          }
        : toCloseAction,
    [onBlur, toCloseAction],
  )

  const isIcon = triggerType === 'icon'
  const actualClassName = useMemo(
    () => classNameGenerator({ isIcon, className }),
    [isIcon, className],
  )
  const isLabel = type === 'label'
  const isInnerTarget = isLabel || isFocusableChild || ariaDescribedbyTarget === 'inner'
  const childrenWithProps = useMemo(
    () =>
      isLabel
        ? cloneElement(children as ReactElement, { 'aria-labelledby': messageId })
        : isInnerTarget
          ? cloneElement(children as ReactElement, { 'aria-describedby': messageId })
          : children,
    [children, isLabel, isInnerTarget, messageId],
  )
  const actualWrapperAriaDescribedby = useMemo(
    () => (!isInnerTarget ? messageId : undefined),
    [isInnerTarget, messageId],
  )

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      {...rest}
      ref={ref}
      tabIndex={actualTabIndex}
      aria-describedby={actualWrapperAriaDescribedby}
      onPointerEnter={onDelegatePointerEnter}
      onTouchStart={onDelegateTouchStart}
      onFocus={onDelegateFocus}
      onPointerLeave={onDelegatePointerLeave}
      onTouchEnd={onDelegateTouchEnd}
      onBlur={onDelegateBlur}
      className={actualClassName}
    >
      {portalRoot &&
        createPortal(
          <TooltipPortal
            message={message}
            isVisible={isVisible}
            parentRect={rect}
            isIcon={isIcon}
          />,
          portalRoot,
        )}
      {childrenWithProps}
      <MemoizedVisuallyHiddenText id={messageId} visible={isVisible}>
        {message}
      </MemoizedVisuallyHiddenText>
    </span>
  )
}

const MemoizedVisuallyHiddenText = memo<PropsWithChildren<{ id: string; visible: boolean }>>(
  ({ id, visible, children }) => {
    const hiddenText = useMemo(() => innerText(children), [children])

    return (
      <VisuallyHiddenText id={id} aria-hidden={!visible}>
        {hiddenText}
      </VisuallyHiddenText>
    )
  },
)
