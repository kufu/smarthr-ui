import React, {
  FocusEvent,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

export type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> & {
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
  prefix?: ReactNode
  suffix?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ onFocus, onBlur, autoFocus, prefix, suffix, className = '', width, ...props }, ref) => {
    const theme = useTheme()
    const innerRef = useRef<HTMLInputElement>(null)

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => innerRef.current,
    )

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      onFocus && onFocus(e)
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      onBlur && onBlur(e)
    }

    useEffect(() => {
      if (autoFocus && innerRef.current) {
        innerRef.current.focus()
      }
    }, [autoFocus])

    const classNames = useClassNames()

    return (
      <Wrapper
        themes={theme}
        $width={width}
        $disabled={props.disabled}
        error={props.error}
        onClick={() => innerRef.current?.focus()}
        className={`${className} ${classNames.wrapper}`}
      >
        {prefix && (
          <Prefix themes={theme} className={classNames.prefix}>
            {prefix}
          </Prefix>
        )}
        <StyledInput
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
          ref={innerRef}
          themes={theme}
          aria-invalid={props.error || undefined}
          className={classNames.input}
        />
        {suffix && (
          <Suffix themes={theme} className={classNames.suffix}>
            {suffix}
          </Suffix>
        )}
      </Wrapper>
    )
  },
)

const Wrapper = styled.span<{
  themes: Theme
  $width?: string | number
  $disabled?: boolean
  error?: boolean
}>(({ themes, $width = 'auto', $disabled, error }) => {
  const { border, radius, color, spacingByChar } = themes
  return css`
    display: inline-flex;
    gap: ${spacingByChar(0.5)};
    align-items: center;
    width: ${typeof $width === 'number' ? `${$width}px` : $width};
    background-color: ${color.WHITE};
    padding-right: ${spacingByChar(0.5)};
    padding-left: ${spacingByChar(0.5)};
    border-radius: ${radius.m};
    border: ${border.shorthand};
    box-sizing: border-box;
    cursor: text;

    ${!$disabled &&
    error &&
    css`
      border-color: ${color.DANGER};
    `}
    ${$disabled &&
    css`
      background-color: ${color.COLUMN};
      pointer-events: none;
    `}
  `
})
const StyledInput = styled.input<Props & { themes: Theme }>`
  ${(props) => {
    const { themes } = props
    const { fontSize, leading, spacingByChar, color, radius } = themes

    return css`
      flex-grow: 1;
      display: inline-block;
      width: 100%;
      padding: ${spacingByChar(0.75)} 0;
      border: none;
      border-radius: ${radius.m};
      font-size: ${fontSize.M};
      color: ${color.TEXT_BLACK};
      line-height: ${leading.NONE};
      background-color: transparent;

      /* font-size * line-height で高さが思うように行かないので、相対値の font-size で高さを指定 */
      height: ${fontSize.M};

      &::placeholder {
        color: ${color.TEXT_GREY};
      }

      &[disabled] {
        color: ${color.TEXT_DISABLED};
        -webkit-text-fill-color: ${color.TEXT_DISABLED};
        opacity: 1;
      }
    `
  }}
`
const Prefix = styled.span<{ themes: Theme }>(
  ({ themes: { color } }) =>
    css`
      display: flex;
      color: ${color.TEXT_GREY};
    `,
)
const Suffix = styled.span<{ themes: Theme }>(
  ({ themes: { color } }) =>
    css`
      display: flex;
      color: ${color.TEXT_GREY};
    `,
)
