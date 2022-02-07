import React, { ReactNode, VFC, useLayoutEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Balloon } from '../Balloon'
import { getTooltipRect } from './tooltipHelper'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = {
  message: ReactNode
  id: string
  parentRect: DOMRect
  isIcon?: boolean
  isMultiLine?: boolean
  horizontal: 'left' | 'center' | 'right' | 'auto'
  vertical: 'top' | 'middle' | 'bottom' | 'auto'
}

export const TooltipPortal: VFC<Props> = ({
  message,
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
  const [actualHorizontal, setActualHorizontal] = useState<'left' | 'center' | 'right' | null>(
    horizontal === 'auto' ? null : horizontal,
  )
  const [actualVertical, setActualVertical] = useState<'top' | 'middle' | 'bottom' | null>(
    vertical === 'auto' ? null : vertical,
  )

  const outerMargin = 10
  useLayoutEffect(() => {
    if (!portalRef.current) {
      return
    }
    const { offsetWidth, offsetHeight } = portalRef.current

    if (vertical === 'auto') {
      const requiredHeight = offsetHeight + outerMargin
      const topSpace = parentRect.top
      const bottomSpace = window.innerHeight - parentRect.bottom
      setActualVertical(() => {
        if (topSpace > requiredHeight) {
          return 'bottom'
        } else if (bottomSpace > requiredHeight || bottomSpace > topSpace) {
          return 'top'
        } else {
          return 'bottom'
        }
      })
    }

    if (horizontal === 'auto') {
      const requiredWidth = offsetWidth + outerMargin
      const leftSpace = vertical === 'middle' ? parentRect.left : parentRect.right
      const rightSpace =
        vertical === 'middle'
          ? window.innerWidth - parentRect.right
          : window.innerWidth - parentRect.left
      setActualHorizontal(() => {
        if (rightSpace > requiredWidth) {
          return 'left'
        } else if (leftSpace > requiredWidth || leftSpace > rightSpace) {
          return 'right'
        } else {
          return 'left'
        }
      })
    }
  }, [horizontal, parentRect, vertical])

  useLayoutEffect(() => {
    if (!portalRef.current || !actualHorizontal || !actualVertical) {
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
        vertical: actualVertical,
        horizontal: actualHorizontal,
        isMultiLine,
        isIcon,
        outerMargin,
      }),
    )
  }, [actualHorizontal, actualVertical, isIcon, isMultiLine, parentRect])

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
      <StyledBalloon
        horizontal={actualHorizontal || 'left'}
        vertical={actualVertical || 'bottom'}
        isMultiLine={isMultiLine}
      >
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
const StyledBalloon = styled(Balloon)<{ isMultiLine?: boolean }>(
  ({ isMultiLine }) =>
    isMultiLine &&
    css`
      max-width: 100%;
      white-space: normal;
    `,
)

const StyledBalloonText = styled.p<{ themes: Theme }>`
  margin: 0;
  ${({ themes: { spacingByChar } }) => {
    return css`
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
    `
  }}
`
