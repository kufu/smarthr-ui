import React, { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { Rect, getContentPositionStyle, Position } from './dropdownHelper'

type Props = {
  triggerRect: Rect
  children: React.ReactNode
}

const DropdownContentInnerComponent: React.FC<Props & InjectedProps> = ({
  triggerRect,
  theme,
  children,
}) => {
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
    <Wrapper
      ref={wrapperRef}
      position={position}
      className={isMounted ? 'active' : ''}
      theme={theme}
    >
      {children}
    </Wrapper>
  )
}

export const DropdownContentInner = withTheme(DropdownContentInnerComponent)

const Wrapper = styled.div`
  ${({ position, theme }: { position: Position } & InjectedProps) => {
    return css`
      visibility: hidden;
      z-index: 99999;
      position: absolute;
      top: ${position.top};
      left: ${position.left};
      border-radius: ${theme.frame.border.radius.m};
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
        0 2px 1px -1px rgba(0, 0, 0, 0.12);
      background-color: #fff;
      white-space: nowrap;

      &.active {
        visibility: visible;
      }
    `
  }}
`
