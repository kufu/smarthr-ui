import React, { HTMLAttributes, ReactNode, VFC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'

import { Props as BalloonProps, BalloonTheme, DarkBalloon, LightBalloon } from '../Balloon'
import { TooltipPortal } from './TooltipPortal'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'
import { useClassNames } from './useClassNames'

type Props = {
  message: ReactNode
  children: ReactNode
  triggerType?: 'icon' | 'text'
  multiLine?: boolean
  ellipsisOnly?: boolean
  horizontal?: BalloonProps['horizontal']
  vertical?: BalloonProps['vertical']
  tabIndex?: number
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props | 'aria-describedby'>

const tooltipFactory = (balloonTheme: BalloonTheme) => {
  const Tooltip: VFC<Props & ElementProps> = ({
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
    const themes = useTheme()
    const [isVisible, setIsVisible] = useState(false)
    const [rect, setRect] = useState<DOMRect | null>(null)
    const ref = React.createRef<HTMLDivElement>()
    const tooltipId = useId()

    const getBalloonWrapperWidth = (): number => {
      if (!ref.current) {
        return 0
      }

      return ref.current.clientWidth
    }
    const getParentWidth = (): number => {
      if (!ref.current) {
        return 0
      }

      return parseInt(
        window
          .getComputedStyle(ref.current.parentNode! as HTMLElement, null)
          .width.match(/\d+/)![0],
        10,
      )
    }

    const getHandlerToShow = <T extends unknown>(handler?: (e: T) => void) => {
      return (e: T) => {
        handler && handler(e)

        if (ref.current) {
          setRect(ref.current.getBoundingClientRect())
        }

        if (!ellipsisOnly) {
          setIsVisible(true)
          return
        }

        const parentWidth = getParentWidth()

        if (parentWidth < 0 || parentWidth > getBalloonWrapperWidth()) {
          return
        }

        setIsVisible(true)
      }
    }

    const getHandlerToHide = <T extends unknown>(handler?: (e: T) => void) => {
      return (e: T) => {
        handler && handler(e)
        setIsVisible(false)
      }
    }

    const StyledBalloon = balloonTheme === 'light' ? StyledLightBalloon : StyledDarkBalloon
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
              id={tooltipId}
              parentRect={rect}
              isIcon={isIcon}
              isMultiLine={multiLine}
              horizontal={horizontal}
              vertical={vertical}
            >
              <StyledBalloon horizontal={horizontal} vertical={vertical} isMultiLine={multiLine}>
                <StyledBalloonText themes={themes}>{message}</StyledBalloonText>
              </StyledBalloon>
            </TooltipPortal>,
            portalRoot,
          )}
        {children}
      </Wrapper>
    )
  }
  return Tooltip
}

export const LightTooltip = tooltipFactory('light')
export const DarkTooltip = tooltipFactory('dark')

const Wrapper = styled.div<{ isIcon?: boolean }>`
  display: inline-block;
  max-width: 100%;
  ${({ isIcon }) =>
    isIcon &&
    css`
      line-height: 0;
    `}
`

const StyledLightBalloon = styled(LightBalloon)<{ isMultiLine?: boolean }>(
  ({ isMultiLine }) =>
    isMultiLine &&
    css`
      max-width: 100%;
      white-space: normal;
    `,
)
const StyledDarkBalloon = StyledLightBalloon.withComponent(DarkBalloon)

const StyledBalloonText = styled.p<{ themes: Theme }>`
  margin: 0;
  ${({ themes: { spacingByChar } }) => {
    return css`
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
    `
  }}
`
