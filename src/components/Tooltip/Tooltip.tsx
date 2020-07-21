import React, { FC, ReactNode, useState } from 'react'
import styled, { css } from 'styled-components'
import { Props as BalloonProps, BalloonTheme, DarkBalloon, LightBalloon } from '../Balloon'
import { TooltipPortal } from './TooltipPortal'
import { Theme, useTheme } from '../../hooks/useTheme'

type Props = {
  id: string
  message: ReactNode
  children: ReactNode
  triggerType?: 'icon' | 'text'
  multiLine?: boolean
  ellipsisOnly?: boolean
  horizontal?: BalloonProps['horizontal']
  vertical?: BalloonProps['vertical']
}

const tooltipFactory: (balloonTheme: BalloonTheme) => FC<Props> = (balloonTheme) => ({
  id,
  message,
  children,
  triggerType,
  multiLine,
  ellipsisOnly = false,
  horizontal = 'left',
  vertical = 'bottom',
}) => {
  const themes = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const ref = React.createRef<HTMLDivElement>()

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
      window.getComputedStyle(ref.current.parentNode! as HTMLElement, null).width.match(/\d+/)![0],
      10,
    )
  }
  const overAction = () => {
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
  const outAction = () => {
    setIsVisible(false)
  }
  const StyledBalloon = balloonTheme === 'light' ? StyledLightBalloon : StyledDarkBalloon
  const isIcon = triggerType === 'icon'

  return (
    <Wrapper
      aria-describedby={isVisible ? id : undefined}
      ref={ref}
      onMouseEnter={overAction}
      onTouchStart={overAction}
      onFocus={overAction}
      onMouseLeave={outAction}
      onTouchEnd={outAction}
      onBlur={outAction}
      tabIndex={0}
      isIcon={isIcon}
    >
      {isVisible && rect && (
        <TooltipPortal
          id={id}
          parentRect={rect}
          isIcon={isIcon}
          isMultiLine={multiLine}
          horizontal={horizontal}
          vertical={vertical}
        >
          <StyledBalloon horizontal={horizontal} vertical={vertical} isMultiLine={multiLine}>
            <StyledBalloonText themes={themes}>{message}</StyledBalloonText>
          </StyledBalloon>
        </TooltipPortal>
      )}
      {children}
    </Wrapper>
  )
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
  ${(props) => {
    const { themes } = props
    const { size } = themes

    return css`
      padding: ${size.pxToRem(size.space.XXS)} ${size.pxToRem(size.space.XS)};
    `
  }}
`
