import React, { FC, useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

import { Rect, getContentBoxStyle, ContentBoxStyle } from './dropdownHelper'

type Props = {
  triggerRect: Rect
  children: React.ReactNode
  className: string
}

export const DropdownContentInner: FC<Props> = ({ triggerRect, children, className }) => {
  const theme = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [contentBox, setContentBox] = useState<ContentBoxStyle>({
    top: '0',
    left: '0',
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
      className={`${className} ${isMounted ? 'active' : ''}`}
      themes={theme}
    >
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme; contentBox: ContentBoxStyle }>`
  ${({ contentBox, themes }) => {
    return css`
      visibility: hidden;
      z-index: 99999;
      position: absolute;
      top: ${contentBox.top};
      left: ${contentBox.left};
      border-radius: ${themes.frame.border.radius.m};
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
