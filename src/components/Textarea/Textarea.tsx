import React, { FC, TextareaHTMLAttributes, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean
  width?: number | string
  autoFocus?: boolean
}

// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
const surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g

const stringLength = (value: string) => {
  return value.length - (value.match(surrogatePairs) || []).length
}

export const Textarea: FC<Props> = ({ autoFocus, maxLength, ...props }) => {
  const theme = useTheme()
  const ref = useRef<HTMLTextAreaElement>(null)
  const [count, setCount] = useState(
    props.defaultValue ? stringLength(props.defaultValue as string) : 0,
  )

  useEffect(() => {
    if (autoFocus && ref && ref.current) {
      ref.current.focus()
    }
  }, [autoFocus])

  const handleKeyup = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setCount(stringLength(event.currentTarget.value))
  }

  return (
    <>
      <StyledTextarea
        {...(maxLength ? { onKeyUp: handleKeyup } : {})}
        {...props}
        ref={ref}
        themes={theme}
      />
      {maxLength && (
        <Counter themes={theme}>
          あと
          <span className={maxLength && maxLength - count <= 0 ? 'error' : ''}>
            {maxLength - count}
          </span>
          文字
        </Counter>
      )}
    </>
  )
}

const StyledTextarea = styled.textarea<Props & { themes: Theme }>`
  ${(props) => {
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

const Counter = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette, size } = themes
    return css`
      font-size: ${size.pxToRem(size.font.SHORT)};
      > span {
        font-weight: bold;
        color: ${palette.TEXT_GREY};
        &.error {
          color: ${palette.DANGER};
        }
      }
    `
  }}
`
