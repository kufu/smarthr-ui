import React, { FC, TextareaHTMLAttributes, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean
  width?: number | string
  autoFocus?: boolean
}

const getStringLength = (value: string | number | readonly string[]) => {
  const formattedValue =
    typeof value === 'number' || typeof value === 'string'
      ? `${value}`
      : Array.isArray(value)
      ? value.join(',')
      : ''

  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
  const surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
  return formattedValue.length - (formattedValue.match(surrogatePairs) || []).length
}

export const Textarea: FC<Props> = ({ autoFocus, maxLength, width, ...props }) => {
  const theme = useTheme()
  const ref = useRef<HTMLTextAreaElement>(null)
  const currentValue = props.defaultValue || props.value
  const [count, setCount] = useState(currentValue ? getStringLength(currentValue) : 0)
  const widthProps = typeof width === 'number' ? `${width}px` : width

  useEffect(() => {
    if (autoFocus && ref && ref.current) {
      ref.current.focus()
    }
  }, [autoFocus])

  const handleKeyup = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setCount(getStringLength(event.currentTarget.value))
  }

  return (
    <>
      <StyledTextarea
        {...(maxLength ? { onKeyUp: handleKeyup } : {})}
        {...props}
        $width={widthProps}
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

const StyledTextarea = styled.textarea<Props & { themes: Theme; $width?: string | number }>`
  ${(props) => {
    const { themes, $width = 'auto', error } = props
    const { size, frame, palette } = themes

    return css`
      padding: ${size.pxToRem(size.space.XXS)};
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.TEXT_BLACK};
      border-radius: ${frame.border.radius.m};
      width: ${$width};
      background-color: #fff;
      outline: none;
      border: ${frame.border.default};
      box-sizing: border-box;
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
