import React, { FC, useEffect, useState, useRef, createContext } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

import { Rect, getContentBoxStyle, ContentBoxStyle } from './dropdownHelper'
import { DropdownCloser } from './DropdownCloser'

type Props = {
  triggerRect: Rect
  scrollable: boolean
  children: React.ReactNode
  className: string
  controllable: boolean
}

type DropdownContentInnerContextType = {
  maxHeight: string
}

export const DropdownContentInnerContext = createContext<DropdownContentInnerContextType>({
  maxHeight: '',
})

export const DropdownContentInner: FC<Props> = ({
  triggerRect,
  scrollable,
  children,
  className,
  controllable,
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
      controllable={controllable}
      themes={theme}
    >
      {controllable ? (
        children
      ) : (
        <DropdownContentInnerContext.Provider value={{ maxHeight: contentBox.maxHeight }}>
          <DropdownCloser>{children}</DropdownCloser>
        </DropdownContentInnerContext.Provider>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  themes: Theme
  contentBox: ContentBoxStyle
  scrollable: boolean
  controllable: boolean
}>`
  ${({ contentBox, themes, scrollable, controllable }) => {
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

      ${controllable
        ? `
          display: flex;
          flex-direction: column;
          `
        : ''}

      ${contentBox.maxHeight && scrollable && controllable
        ? `
          max-height: ${contentBox.maxHeight};
          `
        : ''}

      &.active {
        visibility: visible;
      }
    `
  }}
`
