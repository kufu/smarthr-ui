import React, { FC, createContext, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { ContentBoxStyle, Rect, getContentBoxStyle } from './dropdownHelper'
import { DropdownCloser } from './DropdownCloser'
import { usePortalZIndex } from '../../hooks/usePortalZIndex'

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
  const zIndex = usePortalZIndex()

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
      zIndex={zIndex}
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
  zIndex: number
}>`
  ${({ contentBox, themes, scrollable, controllable, zIndex }) => {
    return css`
      visibility: hidden;
      z-index: ${zIndex};
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
