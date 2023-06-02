import React, {
  FC,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'

import { useEnhancedEffect } from '../../hooks/useEnhancedEffect'
import { useId } from '../../hooks/useId'
import { Theme, useTheme } from '../../hooks/useTheme'
import { Props as BalloonProps } from '../Balloon'

import { TooltipPortal } from './TooltipPortal'
import { useClassNames } from './useClassNames'

const subscribeFullscreenChange = (callback: () => void) => {
  if (typeof window !== 'undefined') window.addEventListener('fullscreenchange', callback)
  return () => {
    if (typeof window !== 'undefined') window.removeEventListener('fullscreenchange', callback)
  }
}
const getFullscreenElement = () => {
  return typeof window !== 'undefined' ? document.fullscreenElement : null
}
const getFullscreenElementOnSSR = () => null

type Props = {
  /** ツールチップ内に表示するメッセージ */
  message: ReactNode
  /** ツールチップを表示する対象の要素 */
  children: ReactNode
  /** ツールチップを表示する対象のタイプ。アイコンの場合は `icon` を指定する */
  triggerType?: 'icon' | 'text'
  /** ツールチップ内を複数行で表示する場合に `true` を指定する */
  multiLine?: boolean
  /** `true` のとき、ツールチップを表示する対象が省略されている場合のみツールチップ表示を有効にする */
  ellipsisOnly?: boolean
  /** 水平方向の位置 */
  horizontal?: BalloonProps['horizontal'] | 'auto'
  /** 垂直方向の位置 */
  vertical?: BalloonProps['vertical'] | 'auto'
  /** ツールチップを表示する対象の tabIndex 値 */
  tabIndex?: number
  /** ツールチップを内包要素に紐付けるかどうか */
  ariaDescribedbyTarget?: 'wrapper' | 'inner'
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props | 'aria-describedby'>

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
  className = '',
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
  const tooltipId = useId()
  const fullscreenElement = useSyncExternalStore(
    subscribeFullscreenChange,
    getFullscreenElement,
    getFullscreenElementOnSSR,
  )

  useEnhancedEffect(() => {
    setPortalRoot(fullscreenElement ?? document.body)
  }, [fullscreenElement])

  const getHandlerToShow = <T,>(handler?: (e: T) => void) => {
    return (e: T) => {
      handler && handler(e)
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
    }
  }

  const getHandlerToHide = <T,>(handler?: (e: T) => void) => {
    return (e: T) => {
      handler && handler(e)
      setIsVisible(false)
    }
  }

  const isIcon = triggerType === 'icon'
  const theme = useTheme()
  const classNames = useClassNames()
  const childrenWithProps =
    ariaDescribedbyTarget === 'inner'
      ? React.cloneElement(children as ReactElement, { 'aria-describedby': tooltipId })
      : children

  return (
    <Wrapper
      {...props}
      aria-describedby={ariaDescribedbyTarget === 'wrapper' ? tooltipId : undefined}
      ref={ref}
      onPointerEnter={getHandlerToShow(onPointerEnter)}
      onTouchStart={getHandlerToShow(onTouchStart)}
      onFocus={getHandlerToShow(onFocus)}
      onPointerLeave={getHandlerToHide(onPointerLeave)}
      onTouchEnd={getHandlerToHide(onTouchEnd)}
      onBlur={getHandlerToHide(onBlur)}
      isIcon={isIcon}
      tabIndex={tabIndex}
      className={`${className} ${classNames.wrapper}`}
      themes={theme}
    >
      {portalRoot &&
        createPortal(
          <TooltipPortal
            message={message}
            id={tooltipId}
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
    </Wrapper>
  )
}

const Wrapper = styled.span<{ isIcon?: boolean; themes: Theme }>`
  ${({ isIcon, themes: { shadow } }) => css`
    display: inline-block;
    max-width: 100%;
    overflow-y: hidden;

    /* inline-block に overflow: visible 以外を指定すると、vertical-align が bottom margin edge に揃ってしまう
     * https://ja.stackoverflow.com/questions/2603/ */
    vertical-align: bottom;

    ${isIcon &&
    css`
      line-height: 0;
    `}

    &:focus-visible {
      ${shadow.focusIndicatorStyles}
    }
  `}
`
