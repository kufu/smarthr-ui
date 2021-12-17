import React, { HTMLAttributes, ReactNode, VFC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'

import { Props as BalloonProps } from '../Balloon'
import { TooltipPortal } from './TooltipPortal'
import { useId } from '../../hooks/useId'
import { useClassNames } from './useClassNames'

type Props = {
  message: ReactNode
  children: ReactNode
  triggerType?: 'icon' | 'text'
  multiLine?: boolean
  ellipsisOnly?: boolean
  horizontal?: BalloonProps['horizontal'] | 'auto'
  vertical?: BalloonProps['vertical'] | 'auto'
  tabIndex?: number
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props | 'aria-describedby'>

export const Tooltip: VFC<Props & ElementProps> = ({
  message,
  children,
  triggerType,
  multiLine,
  ellipsisOnly = false,
  horizontal = 'left',
  vertical = 'bottom',
  tabIndex = 0,
  className = '',
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const ref = React.createRef<HTMLDivElement>()
  const tooltipId = useId()

  const getHandlerToShow = <T extends unknown>(handler?: (e: T) => void) => {
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

  const getHandlerToHide = <T extends unknown>(handler?: (e: T) => void) => {
    return (e: T) => {
      handler && handler(e)
      setIsVisible(false)
    }
  }

  const isIcon = triggerType === 'icon'

  const portalRoot = useRef(document.createElement('div')).current
  useEffect(() => {
    document.body.appendChild(portalRoot)

    return () => {
      document.body.removeChild(portalRoot)
    }
  }, [portalRoot])

  const classNames = useClassNames()

  return (
    <Wrapper
      {...props}
      aria-describedby={isVisible ? tooltipId : undefined}
      ref={ref}
      onMouseEnter={getHandlerToShow(onMouseEnter)}
      onTouchStart={getHandlerToShow(onTouchStart)}
      onFocus={getHandlerToShow(onFocus)}
      onMouseLeave={getHandlerToHide(onMouseLeave)}
      onTouchEnd={getHandlerToHide(onTouchEnd)}
      onBlur={getHandlerToHide(onBlur)}
      isIcon={isIcon}
      tabIndex={tabIndex}
      className={`${className} ${classNames.wrapper}`}
    >
      {isVisible &&
        rect &&
        createPortal(
          <TooltipPortal
            message={message}
            id={tooltipId}
            parentRect={rect}
            isIcon={isIcon}
            isMultiLine={multiLine}
            horizontal={horizontal}
            vertical={vertical}
          />,
          portalRoot,
        )}
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ isIcon?: boolean }>`
  display: inline-block;
  max-width: 100%;
  overflow-y: hidden;

  /* inline-block に overflow: visible 以外を指定すると、vertical-align が bottom margin edge に揃ってしまう
   * https://ja.stackoverflow.com/questions/2603/ */
  vertical-align: bottom;

  ${({ isIcon }) =>
    isIcon &&
    css`
      line-height: 0;
    `}
`
