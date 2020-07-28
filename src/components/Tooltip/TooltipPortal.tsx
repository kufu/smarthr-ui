import React, { FC, ReactNode, useLayoutEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { getTooltipRect } from './tooltipHelper'

type Props = {
  id: string
  parentRect: DOMRect
  children: ReactNode
  isIcon?: boolean
  isMultiLine?: boolean
  horizontal: 'left' | 'center' | 'right'
  vertical: 'top' | 'middle' | 'bottom'
}

export const TooltipPortal: FC<Props> = ({
  id,
  parentRect,
  children,
  isIcon = false,
  isMultiLine = false,
  horizontal,
  vertical,
}) => {
  const portalRef = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
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

  return (
    <Container id={id} ref={portalRef} {...rect}>
      {children}
    </Container>
  )
}

const Container = styled.div<{
  top: number
  left: number
  width: number
  height: number
}>(
  ({ top, left, width, height }) => css`
    position: absolute;
    top: ${top}px;
    left: ${left}px;
    ${width > 0 &&
    css`
      width: ${width}px;
    `}
    ${height > 0 &&
    css`
      height: ${height}px;
    `}
    z-index: 9000;
  `,
)
