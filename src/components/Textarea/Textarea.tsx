import React, { TextareaHTMLAttributes, FC, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean
  width?: number | string
  autoFocus?: boolean
}

export const Textarea: FC<Props> = ({ autoFocus, ...props }) => {
  const theme = useTheme()
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocus && ref && ref.current) {
      ref.current.focus()
    }
  }, [autoFocus])

  return <StyledTextarea {...props} ref={ref} themes={theme} />
}

const StyledTextarea = styled.textarea<Props & { themes: Theme }>`
  ${props => {
    const { themes, width = 'auto', error } = props
    const { size, frame, palette } = themes

    return css`
      padding: ${size.pxToRem(size.space.XXS)};
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.TEXT_BLACK};
      border-radius: ${frame.border.radius.m};
      ${width &&
        css`
          width: ${typeof width === 'number' ? `${width}px` : width};
        `}
      background-color: #fff;
      resize: vertical;
      outline: none;
      border: ${frame.border.default};
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
