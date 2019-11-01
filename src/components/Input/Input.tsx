import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

export type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  type?: 'text' | 'number' | 'password'
  error?: boolean
  width?: number | string
  autoFocus?: boolean
}

const InputComponent: React.FC<Props & InjectedProps> = ({ autoFocus, ...props }) => {
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (autoFocus && ref && ref.current) {
      ref.current.focus()
    }
  }, [autoFocus])

  return <StyledInput {...props} ref={ref} />
}

const StyledInput = styled.input<Props>`
  ${props => {
    const { theme, width = 'auto', error } = props
    const { size, frame, palette } = theme
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
        border-color: ${palette.BORDER};
        pointer-events: none;
      }
    `
  }}
`

export const Input = withTheme(InputComponent)
