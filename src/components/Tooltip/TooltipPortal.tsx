import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  useEffect(() => {
    if (!parentRect || !portalRef.current) {
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
  }, [portalRef.current])

  const element = useRef(document.createElement('div')).current
  useEffect(() => {
    document.body.appendChild(element)

    return () => {
      document.body.removeChild(element)
    }
  }, [element])

  return createPortal(
    <Container id={id} ref={portalRef} {...rect}>
      {children}
    </Container>,
    element,
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
