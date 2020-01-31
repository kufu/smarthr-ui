import React, { FC, InputHTMLAttributes, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

export type Props = InputHTMLAttributes<HTMLInputElement> & {
  type?:
    | 'text'
    | 'search'
    | 'tel'
    | 'url'
    | 'email'
    | 'password'
    | 'datetime'
    | 'date'
    | 'month'
    | 'week'
    | 'time'
    | 'datetime-local'
    | 'number'
  error?: boolean
  width?: number | string
  autoFocus?: boolean
}

export const Input: FC<Props> = ({ autoFocus, ...props }) => {
  const theme = useTheme()
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && ref && ref.current) {
      ref.current.focus()
    }
  }, [autoFocus])

  return <StyledInput {...props} ref={ref} themes={theme} />
}

const StyledInput = styled.input<Props & { themes: Theme }>`
  ${props => {
    const { themes, width = 'auto', error } = props
    const { size, frame, palette } = themes

    return css`
      display: inline-block;
      width: ${typeof width === 'number' ? `${width}px` : width};
      padding: ${size.pxToRem(size.space.XXS)};
      border-radius: ${frame.border.radius.m};
      border: ${frame.border.default};
      background-color: #fff;
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.TEXT_BLACK};
      line-height: 1.6;
      outline: none;
      box-sizing: border-box;

      &::placeholder {
        color: ${palette.TEXT_GREY};
      }

      ${error
        ? css`
            border-color: ${palette.DANGER};
          `
        : css`
            &:focus {
              border-color: ${palette.hoverColor(palette.MAIN)};
            }
          `}

      &[disabled] {
        background-color: ${palette.COLUMN};
        pointer-events: none;
        color: ${palette.TEXT_DISABLED};
      }
    `
  }}
`
