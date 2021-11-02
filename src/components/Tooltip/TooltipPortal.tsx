import React, { ReactNode, VFC, useLayoutEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { BalloonTheme, DarkBalloon, LightBalloon } from '../Balloon'
import { getTooltipRect } from './tooltipHelper'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = {
  message: ReactNode
  balloonTheme: BalloonTheme
  id: string
  parentRect: DOMRect
  isIcon?: boolean
  isMultiLine?: boolean
  horizontal: 'left' | 'center' | 'right'
  vertical: 'top' | 'middle' | 'bottom'
}

export const TooltipPortal: VFC<Props> = ({
  message,
  balloonTheme,
  id,
  parentRect,
  isIcon = false,
  isMultiLine = false,
  horizontal,
  vertical,
}) => {
  const theme = useTheme()
  const portalRef = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState({
    top: 0,
    left: 0,
    $width: isMultiLine ? parentRect.width : 0,
    $height: 0,
  })
  useLayoutEffect(() => {
    if (!portalRef.current) {
      return
    }
    const { offsetWidth, offsetHeight } = portalRef.current
    setRect(
      getTooltipRect({
        parentRect,
        tooltipSize: {
          width: offsetWidth,
          height: offsetHeight,
        },
        vertical,
        horizontal,
        isMultiLine,
        isIcon,
        outerMargin: 10,
      }),
    )
  }, [horizontal, isIcon, isMultiLine, parentRect, vertical])

  const StyledBalloon = balloonTheme === 'light' ? StyledLightBalloon : StyledDarkBalloon
  const classNames = useClassNames()

  return (
    <Container
      id={id}
      ref={portalRef}
      themes={theme}
      role="tooltip"
      className={classNames.popup}
      {...rect}
    >
      <StyledBalloon horizontal={horizontal} vertical={vertical} isMultiLine={isMultiLine}>
        <StyledBalloonText themes={theme}>{message}</StyledBalloonText>
      </StyledBalloon>
    </Container>
  )
}

const Container = styled.div<{
  top: number
  left: number
  $width: number
  $height: number
  themes: Theme
}>`
  ${({ top, left, $width, $height, themes }) => {
    return css`
      position: absolute;
      top: ${top}px;
      left: ${left}px;
      ${$width > 0 &&
      css`
        width: ${$width}px;
      `}
      ${$height > 0 &&
      css`
        height: ${$height}px;
      `}
        z-index: ${themes.zIndex.OVERLAP};
    `
  }}
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
