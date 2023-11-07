import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Balloon } from '../Balloon'

import { getTooltipRect } from './tooltipHelper'
import { useClassNames } from './useClassNames'

type Props = {
  message: ReactNode
  id: string
  isVisible: boolean
  parentRect: DOMRect | null
  isIcon?: boolean
  isMultiLine?: boolean
  horizontal: 'left' | 'center' | 'right' | 'auto'
  vertical: 'top' | 'middle' | 'bottom' | 'auto'
  fullscreenElement: Element | null
}

export const TooltipPortal: FC<Props> = ({
  message,
  id,
  isVisible,
  parentRect,
  isIcon = false,
  isMultiLine = false,
  horizontal,
  vertical,
  fullscreenElement,
}) => {
  const theme = useTheme()
  const portalRef = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState({
    top: 0,
    left: 0,
    $width: 0,
    $height: 0,
  })
  const [actualHorizontal, setActualHorizontal] = useState<'left' | 'center' | 'right' | null>(
    horizontal === 'auto' ? null : horizontal,
  )
  const [actualVertical, setActualVertical] = useState<'top' | 'middle' | 'bottom' | null>(
    vertical === 'auto' ? null : vertical,
  )

  const outerMargin = 10
  useEffect(() => {
    if (!portalRef.current || !parentRect) {
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

  useEffect(() => {
    if (!isVisible || !portalRef.current || !actualHorizontal || !actualVertical || !parentRect) {
      return
    }
    const scrollOffsetTop = fullscreenElement ? fullscreenElement.scrollTop : window.scrollY
    const scrollOffsetLeft = fullscreenElement ? fullscreenElement.scrollLeft : window.scrollX
    const { offsetWidth, offsetHeight } = portalRef.current
    setRect(
      getTooltipRect({
        parentRect,
        scrollOffset: {
          top: scrollOffsetTop,
          left: scrollOffsetLeft,
        },
        tooltipSize: {
          width: offsetWidth,
          height: offsetHeight,
        },
        vertical: actualVertical,
        horizontal: actualHorizontal,
        isIcon,
        outerMargin,
      }),
    )
  }, [actualHorizontal, actualVertical, fullscreenElement, isIcon, isVisible, parentRect])

  const classNames = useClassNames()

  return (
    <Container
      {...rect}
      id={id}
      ref={portalRef}
      themes={theme}
      role="tooltip"
      className={classNames.popup}
      aria-hidden={!isVisible}
      maxWidth={isMultiLine ? parentRect?.width : undefined}
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
  maxWidth?: number
  themes: Theme
}>`
  ${({ top, left, $width, $height, maxWidth, themes }) => css`
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
      ${maxWidth !== undefined &&
    css`
      max-width: ${maxWidth}px;
    `}
      z-index: ${themes.zIndex.OVERLAP};
    &[aria-hidden='true'] {
      display: none;
    }
  `}
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
  ${({ themes: { spacingByChar } }) => css`
    padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
  `}
`
