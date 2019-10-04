import React, { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components'

import { Rect, getContentPositionStyle, Position } from './dropdownHelper'

type Props = {
  triggerRect: Rect
}

export const DropdownContentInner: React.FC<Props> = ({ triggerRect, children }) => {
  const [isMounted, setIsMounted] = useState(false)
  const [position, setPosition] = useState<Position>({
    top: 'auto',
    left: 'auto',
  })
  const wrapperRef = useRef(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && wrapperRef.current) {
      const contentPosition = getContentPositionStyle(
        triggerRect,
        {
          width: (wrapperRef.current as any).offsetWidth,
          height: (wrapperRef.current as any).offsetHeight,
        },
        {
          width: innerWidth,
          height: innerHeight,
        },
        {
          top: pageYOffset,
          left: pageXOffset,
        },
      )
      setPosition(contentPosition)
    }
  }, [isMounted, triggerRect])

  return (
    <Wrapper ref={wrapperRef} position={position}>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${({ position }: { position: Position }) => {
    return css`
      position: absolute;
      top: ${position.top};
      left: ${position.left};
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
        0 2px 1px -1px rgba(0, 0, 0, 0.12);
      background-color: #fff;
      white-space: nowrap;
    `
  }}
`
