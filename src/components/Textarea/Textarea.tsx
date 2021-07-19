import React, { TextareaHTMLAttributes, VFC, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = {
  error?: boolean
  width?: number | string
  autoFocus?: boolean
}
type ElementProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof Props>

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

export const Textarea: VFC<Props & ElementProps> = ({
  autoFocus,
  maxLength,
  width,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const ref = useRef<HTMLTextAreaElement>(null)
  const currentValue = props.defaultValue || props.value
  const [count, setCount] = useState(currentValue ? getStringLength(currentValue) : 0)
  const textAreaWidth = typeof width === 'number' ? `${width}px` : width

  useEffect(() => {
    if (autoFocus && ref && ref.current) {
      ref.current.focus()
    }
  }, [autoFocus])

  const handleKeyup = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setCount(getStringLength(event.currentTarget.value))
  }

  const classNames = useClassNames()

  return (
    <>
      <StyledTextarea
        {...(maxLength ? { onKeyUp: handleKeyup } : {})}
        textAreaWidth={textAreaWidth}
        ref={ref}
        themes={theme}
        aria-invalid={props.error || undefined}
        className={`${className} ${classNames.textarea}`}
        {...props}
      />
      {maxLength && (
        <Counter themes={theme} className={classNames.counter}>
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

const StyledTextarea = styled.textarea<Props & { themes: Theme; textAreaWidth?: string | number }>`
  ${(props) => {
    const { themes, textAreaWidth = 'auto', error } = props
    const { fontSize, spacingByChar, border, radius, color } = themes

    return css`
      padding: ${spacingByChar(0.5)};
      font-size: ${fontSize.M};
      color: ${color.TEXT_BLACK};
      border-radius: ${radius.m};
      width: ${textAreaWidth};
      background-color: #fff;
      border: ${border.shorthand};
      box-sizing: border-box;
      opacity: 1;
      ${error
        ? css`
            border-color: ${color.DANGER};
          `
        : css`
            &:focus {
              border-color: ${color.hoverColor(color.MAIN)};
            }
          `}

      &::placeholder {
        color: ${color.TEXT_GREY};
      }
      &[disabled] {
        background-color: ${color.COLUMN};
        pointer-events: none;

        &,
        &::placeholder {
          color: ${color.TEXT_DISABLED};
        }
      }
    `
  }}
`

const Counter = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, color } = themes
    return css`
      font-size: ${fontSize.S};
      > span {
        font-weight: bold;
        color: ${color.TEXT_GREY};
        &.error {
          color: ${color.DANGER};
        }
      }
    `
  }}
`
