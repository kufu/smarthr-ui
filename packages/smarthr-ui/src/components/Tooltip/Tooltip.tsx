'use client'

import {
  type BaseSyntheticEvent,
  type ComponentProps,
  type FC,
  type FocusEvent,
  type PointerEvent,
  type PropsWithChildren,
  type ReactNode,
  type TouchEvent,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'
import { tv } from 'tailwind-variants'

import { useEnhancedEffect } from '../../hooks/useEnhancedEffect'

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
  const childrenWrapperId = `${messageId}-children-wrapper`
  const fullscreenElement = useSyncExternalStore(
    subscribeFullscreenChange,
    getFullscreenElement,
    getFullscreenElementOnSSR,
  )

  const [isFocusableChild, setIsFocusableChild] = useState(false)
  const [actualTabIndex, setActualTabIndex] = useState<number | undefined>(tabIndex ?? 0)

  const isLabel = type === 'label'

  useEnhancedEffect(() => {
    setPortalRoot(fullscreenElement ?? document.body)
  }, [fullscreenElement])

  useEnhancedEffect(() => {
    const childElement = ref.current?.querySelector<HTMLElement>(
      `:scope > #${childrenWrapperId} > *`,
    )

    const focusable =
      !!childElement &&
      childElement.matches(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

    setIsFocusableChild(focusable)
    setActualTabIndex(tabIndex !== undefined ? tabIndex : focusable ? undefined : 0)

    // focusableな要素に直接aria属性を設定
    if (focusable) {
      childElement.setAttribute(isLabel ? 'aria-labelledby' : 'aria-describedby', messageId)
    }
  }, [tabIndex, isLabel, messageId, childrenWrapperId])

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

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      {...rest}
      ref={ref}
      tabIndex={actualTabIndex}
      aria-describedby={
        isLabel || isFocusableChild || ariaDescribedbyTarget === 'inner' ? undefined : messageId
      }
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
            messageId={messageId}
            message={message}
            isVisible={isVisible}
            parentRect={rect}
            isIcon={isIcon}
          />,
          portalRoot,
        )}
      <span id={childrenWrapperId} className="shr-contents">
        {children}
      </span>
    </span>
  )
}
