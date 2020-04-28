import React, { ReactNode, FC, useState } from 'react'
import styled, { css } from 'styled-components'
import { LightBalloon, DarkBalloon, Props as BalloonProps, BalloonTheme } from '../Balloon'
import { useTheme, Theme } from '../../hooks/useTheme'

type Props = {
  message: ReactNode
  children: ReactNode
  triggerType?: 'icon' | 'text'
  multiLine?: boolean
  ellipsisOnly?: boolean
  horizontal?: BalloonProps['horizontal']
  vertical?: BalloonProps['vertical']
}

const tooltipFactory: (balloonTheme: BalloonTheme) => FC<Props> = balloonTheme => ({
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

  const className = [triggerType === 'icon' ? 'icon-tooltip' : '', multiLine ? 'multi-line' : '']
    .filter(c => !!c)
    .join(' ')
  const ref = React.createRef<HTMLSpanElement>()

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

  return (
    <Wrapper
      ref={ref}
      onMouseOver={overAction}
      onTouchStart={overAction}
      onMouseOut={outAction}
      onTouchEnd={outAction}
    >
      {isVisible && (
        <StyledBalloon horizontal={horizontal} vertical={vertical} className={className}>
          <StyledBalloonText themes={themes}>{message}</StyledBalloonText>
        </StyledBalloon>
      )}
      {children}
    </Wrapper>
  )
}

export const LightTooltip = tooltipFactory('light')
export const DarkTooltip = tooltipFactory('dark')

const Wrapper = styled.span`
  position: relative;
  display: inline-block;
  max-width: 100%;
`

const StyledLightBalloon = styled(LightBalloon)<{
  horizontal: BalloonProps['horizontal']
  vertical: BalloonProps['vertical']
}>`
  position: absolute;
  z-index: 9000;

  &.multi-line {
    max-width: 100%;
    white-space: normal;
  }

  ${({ horizontal, vertical }) => {
    switch (horizontal) {
      case 'left':
        switch (vertical) {
          case 'bottom':
            return css`
              left: 0;
              bottom: calc(100% + 10px);
            `
          case 'middle':
            return css`
              left: calc(100% + 10px);
              top: 50%;
              transform: translate(0, -50%);
            `
          case 'top':
            return css`
              left: 0;
              top: calc(100% + 10px);
            `
        }
        break
      case 'center':
        switch (vertical) {
          case 'bottom':
            return css`
              left: 50%;
              bottom: calc(100% + 10px);
              transform: translate(-50%, 0);
            `
          case 'top':
            return css`
              left: 50%;
              top: calc(100% + 10px);
              transform: translate(-50%, 0);
            `
        }
        break
      case 'right':
        switch (vertical) {
          case 'bottom':
            return css`
              right: 0;
              bottom: calc(100% + 10px);
            `
          case 'middle':
            return css`
              right: calc(100% + 10px);
              top: 50%;
              transform: translate(0, -50%);
            `
          case 'top':
            return css`
              right: 0;
              top: calc(100% + 10px);
            `
        }
        break
    }

    return ''
  }}

  &.icon-tooltip {
    ${({ horizontal, vertical }) => {
      switch (horizontal) {
        case 'left':
          switch (vertical) {
            case 'bottom':
              return css`
                left: 50%;
                bottom: calc(100% + 10px);
                transform: translate(-29px, 0);
              `
            case 'middle':
              return css`
                left: calc(100% + 10px);
                top: calc(50% - 2px);
                transform: translate(0, -50%);
              `
            case 'top':
              return css`
                left: 50%;
                top: calc(100% + 10px);
                transform: translate(-29px, 0);
              `
          }
          break
        case 'center':
          switch (vertical) {
            case 'bottom':
              return css`
                left: 50%;
                bottom: calc(100% + 10px);
                transform: translate(-50%, 0);
              `
            case 'top':
              return css`
                left: 50%;
                top: calc(100% + 10px);
                transform: translate(-50%, 0);
              `
          }
          break
        case 'right':
          switch (vertical) {
            case 'bottom':
              return css`
                right: 50%;
                bottom: calc(100% + 10px);
                transform: translate(29px, 0);
              `
            case 'middle':
              return css`
                right: calc(100% + 10px);
                top: calc(50% - 2px);
                transform: translate(0, -50%);
              `
            case 'top':
              return css`
                right: 0;
                top: calc(100% + 10px);
                transform: translate(19px, 0);
              `
          }
          break
      }

      return ''
    }}
  }
`
const StyledDarkBalloon = StyledLightBalloon.withComponent(DarkBalloon)

const StyledBalloonText = styled.p<{ themes: Theme }>`
  margin: 0;
  ${props => {
    const { themes } = props
    const { size } = themes

    return css`
      padding: ${size.pxToRem(size.space.XXS)} ${size.pxToRem(size.space.XS)};
    `
  }}
`
