'use client'

import React, {
  ComponentProps,
  FC,
  PropsWithChildren,
  ReactElement,
  ReactNode,
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
import { Balloon } from '../Balloon'
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

type Props = PropsWithChildren<{
  /** ツールチップ内に表示するメッセージ */
  message: ReactNode
  /** ツールチップを表示する対象のタイプ。アイコンの場合は `icon` を指定する */
  triggerType?: 'icon' | 'text'
  /** ツールチップ内を複数行で表示する場合に `true` を指定する */
  multiLine?: boolean
  /** `true` のとき、ツールチップを表示する対象が省略されている場合のみツールチップ表示を有効にする */
  ellipsisOnly?: boolean
  /** 水平方向の位置 */
  horizontal?: ComponentProps<typeof Balloon>['horizontal'] | 'auto'
  /** 垂直方向の位置 */
  vertical?: ComponentProps<typeof Balloon>['vertical'] | 'auto'
  /** ツールチップを表示する対象の tabIndex 値 */
  tabIndex?: number
  /** ツールチップを内包要素に紐付けるかどうか */
  ariaDescribedbyTarget?: 'wrapper' | 'inner'
}>
type ElementProps = Omit<ComponentProps<'span'>, keyof Props | 'aria-describedby'>

const tooltip = tv({
  base: [
    'smarthr-ui-Tooltip',
    'shr-inline-block shr-max-w-full shr-align-bottom',
    'focus-visible:shr-focus-indicator',
  ],
  variants: {
    isIcon: {
      true: 'shr-leading-[0]',
    },
  },
})

export const Tooltip: FC<Props & ElementProps> = ({
  message,
  children,
  triggerType,
  multiLine,
  ellipsisOnly = false,
  horizontal = 'left',
  vertical = 'bottom',
  tabIndex = 0,
  ariaDescribedbyTarget = 'wrapper',
  className,
  onPointerEnter,
  onPointerLeave,
  onTouchStart,
  onTouchEnd,
  onFocus,
  onBlur,
  ...props
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

  useEnhancedEffect(() => {
    setPortalRoot(fullscreenElement ?? document.body)
  }, [fullscreenElement])

  const getHandlerToShow = useCallback(
    <T,>(handler?: (e: T) => void) =>
      (e: T) => {
        if (handler) {
          handler(e)
        }

        if (!ref.current) {
          return
        }

        if (ellipsisOnly) {
          const outerWidth = parseInt(
            window
              .getComputedStyle(ref.current.parentNode! as HTMLElement, null)
              .width.match(/\d+/)![0],
            10,
          )
          const wrapperWidth = ref.current.clientWidth
          const existsEllipsis = outerWidth >= 0 && outerWidth <= wrapperWidth

          if (!existsEllipsis) {
            return
          }
        }

        setRect(ref.current.getBoundingClientRect())
        setIsVisible(true)
      },
    [ellipsisOnly],
  )

  const getHandlerToHide = useCallback(
    <T,>(handler?: (e: T) => void) =>
      (e: T) => {
        if (handler) {
          handler(e)
        }

        setIsVisible(false)
      },
    [setIsVisible],
  )

  const hiddenText = useMemo(() => innerText(message), [message])
  const isIcon = triggerType === 'icon'
  const styles = tooltip({ isIcon, className })
  const isInnerTarget = ariaDescribedbyTarget === 'inner'
  const childrenWithProps = useMemo(
    () =>
      isInnerTarget
        ? React.cloneElement(children as ReactElement, { 'aria-describedby': messageId })
        : children,
    [children, isInnerTarget, messageId],
  )

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions,smarthr/a11y-delegate-element-has-role-presentation
    <span
      {...props}
      aria-describedby={isInnerTarget ? undefined : messageId}
      ref={ref}
      onPointerEnter={getHandlerToShow(onPointerEnter)}
      onTouchStart={getHandlerToShow(onTouchStart)}
      onFocus={getHandlerToShow(onFocus)}
      onPointerLeave={getHandlerToHide(onPointerLeave)}
      onTouchEnd={getHandlerToHide(onTouchEnd)}
      onBlur={getHandlerToHide(onBlur)}
      tabIndex={tabIndex}
      className={styles}
    >
      {portalRoot &&
        createPortal(
          <TooltipPortal
            message={message}
            isVisible={isVisible}
            parentRect={rect}
            isIcon={isIcon}
            isMultiLine={multiLine}
            horizontal={horizontal}
            vertical={vertical}
            fullscreenElement={fullscreenElement}
          />,
          portalRoot,
        )}
      {childrenWithProps}
      <VisuallyHiddenText id={messageId} aria-hidden={!isVisible}>
        {hiddenText}
      </VisuallyHiddenText>
    </span>
  )
}
