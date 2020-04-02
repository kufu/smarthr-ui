import React, { FC, useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

import { Rect, getContentBoxStyle, ContentBoxStyle } from './dropdownHelper'

type Props = {
  triggerRect: Rect
  scrollable: boolean
  children: React.ReactNode
  className: string
}

export const DropdownContentInner: FC<Props> = ({
  triggerRect,
  scrollable,
  children,
  className,
}) => {
  const theme = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [isActive, setIsActive] = useState(false)
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
      setIsActive(true)
    }
  }, [isMounted, triggerRect])

  return (
    <Wrapper
      ref={wrapperRef}
      contentBox={contentBox}
      scrollable={scrollable}
      className={`${className} ${isActive ? 'active' : ''}`}
      themes={theme}
    >
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme; contentBox: ContentBoxStyle; scrollable: boolean }>`
  ${({ contentBox, themes, scrollable }) => {
    return css`
      visibility: hidden;
      z-index: 99999;
      position: absolute;
      top: ${contentBox.top};
      left: ${contentBox.left};
      border-radius: ${themes.frame.border.radius.m};
      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);
      background-color: #fff;
      white-space: nowrap;

      &.active {
        visibility: visible;
      }

      ${contentBox.maxHeight && scrollable
        ? `
          overflow-y: scroll;
          max-height: ${contentBox.maxHeight};
      `
        : ''}
    `
  }}
`
