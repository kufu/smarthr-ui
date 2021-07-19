import React, {
  FocusEvent,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
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
    const prefixRef = useRef<HTMLSpanElement>(null)
    const suffixRef = useRef<HTMLScriptElement>(null)
    const [prefixWidth, setPrefixWidth] = useState(0)
    const [suffixWidth, setSuffixWidth] = useState(0)

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

    useLayoutEffect(() => {
      if (prefixRef.current) {
        setPrefixWidth(prefixRef.current.clientWidth)
      }
    }, [prefix])
    useLayoutEffect(() => {
      if (suffixRef.current) {
        setSuffixWidth(suffixRef.current.clientWidth)
      }
    }, [suffix])

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
          <Prefix themes={theme} ref={prefixRef} className={classNames.prefix}>
            {prefix}
          </Prefix>
        )}
        <StyledInput
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
          prefixWidth={prefixWidth}
          suffixWidth={suffixWidth}
          ref={innerRef}
          themes={theme}
          aria-invalid={props.error || undefined}
          className={classNames.input}
        />
        {suffix && (
          <Suffix themes={theme} ref={suffixRef} className={classNames.suffix}>
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
  const { border, radius, color } = themes
  return css`
    position: relative;
    display: inline-flex;
    align-items: stretch;
    width: ${typeof $width === 'number' ? `${$width}px` : $width};
    background-color: #fff;
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
const StyledInput = styled.input<
  Props & { prefixWidth: number; suffixWidth: number; themes: Theme }
>`
  ${(props) => {
    const { prefixWidth, suffixWidth, themes } = props
    const { fontSize, spacingByChar, color, radius } = themes

    return css`
      flex-grow: 1;
      display: inline-block;
      width: 100%;
      padding-top: ${spacingByChar(0.5)};
      padding-bottom: ${spacingByChar(0.5)};
      padding-left: calc(${spacingByChar(0.5)} + ${prefixWidth}px);
      padding-right: calc(${spacingByChar(0.5)} + ${suffixWidth}px);
      border: none;
      border-radius: ${radius.m};
      font-size: ${fontSize.M};
      color: ${color.TEXT_BLACK};
      line-height: 1.6;
      box-sizing: border-box;
      background-color: transparent;

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
  ({ themes: { color, spacingByChar } }) =>
    css`
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      padding-left: ${spacingByChar(0.5)};
      color: ${color.TEXT_GREY};
    `,
)
const Suffix = styled.span<{ themes: Theme }>(
  ({ themes: { color, spacingByChar } }) =>
    css`
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      padding-right: ${spacingByChar(0.5)};
      color: ${color.TEXT_GREY};
    `,
)
