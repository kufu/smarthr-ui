import React, { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { Rect, getContentBoxStyle, ContentBoxStyle } from './dropdownHelper'

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
  const [contentBox, setContentBox] = useState<ContentBoxStyle>({
    top: 'auto',
    left: 'auto',
    maxHeight: '',
  })
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && wrapperRef.current) {
      setContentBox(
        getContentBoxStyle(
          triggerRect,
          {
            width: wrapperRef.current.offsetWidth,
            height: wrapperRef.current.offsetHeight,
          },
          {
            width: innerWidth,
            height: innerHeight,
          },
          {
            top: pageYOffset,
            left: pageXOffset,
          },
        ),
      )
    }
  }, [isMounted, triggerRect])

  return (
    <Wrapper
      ref={wrapperRef}
      contentBox={contentBox}
      className={isMounted ? 'active' : ''}
      theme={theme}
    >
      {children}
    </Wrapper>
  )
}

export const DropdownContentInner = withTheme(DropdownContentInnerComponent)

const Wrapper = styled.div`
  ${({ contentBox, theme }: { contentBox: ContentBoxStyle } & InjectedProps) => {
    return css`
      visibility: hidden;
      z-index: 99999;
      position: absolute;
      top: ${contentBox.top};
      left: ${contentBox.left};
      border-radius: ${theme.frame.border.radius.m};
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
        0 2px 1px -1px rgba(0, 0, 0, 0.12);
      background-color: #fff;
      white-space: nowrap;

      &.active {
        visibility: visible;
      }

      ${contentBox.maxHeight
        ? `
          overflow-y: scroll;
          max-height: ${contentBox.maxHeight};
      `
        : ''}
    `
  }}
`
