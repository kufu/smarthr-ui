import React, {
  FocusEvent,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

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
  ({ onFocus, onBlur, autoFocus, prefix, suffix, className, width, ...props }, ref) => {
    const theme = useTheme()
    const innerRef = useRef<HTMLInputElement>(null)
    const [isFocused, setIsFocused] = useState(false)

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => innerRef.current,
    )

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus && onFocus(e)
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur && onBlur(e)
    }

    useEffect(() => {
      if (autoFocus && innerRef.current) {
        innerRef.current.focus()
      }
    }, [autoFocus])

    return (
      <Wrapper
        themes={theme}
        $width={width}
        isFocused={isFocused}
        disabled={props.disabled}
        error={props.error}
        onClick={() => innerRef.current?.focus()}
        className={className}
      >
        {prefix && <Prefix themes={theme}>{prefix}</Prefix>}
        <StyledInput
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
          ref={innerRef}
          themes={theme}
        />
        {suffix && <Suffix themes={theme}>{suffix}</Suffix>}
      </Wrapper>
    )
  },
)

const Wrapper = styled.span<{
  themes: Theme
  $width?: string | number
  isFocused: boolean
  disabled?: boolean
  error?: boolean
}>(({ themes, $width = 'auto', isFocused, disabled, error }) => {
  const { frame, palette, size } = themes
  return css`
    display: inline-flex;
    align-items: stretch;
    width: ${typeof $width === 'number' ? `${$width}px` : $width};
    padding: 0 ${size.pxToRem(size.space.XXS)};
    background-color: #fff;
    border-radius: ${frame.border.radius.m};
    border: ${frame.border.default};
    box-sizing: border-box;
    cursor: text;
    ${isFocused &&
    css`
      border-color: ${palette.hoverColor(palette.MAIN)};
    `}
    ${error &&
    css`
      border-color: ${palette.DANGER};
    `}
    ${disabled &&
    css`
      background-color: ${palette.COLUMN};
      pointer-events: none;
    `}
  `
})
const StyledInput = styled.input<Props & { themes: Theme }>`
  ${(props) => {
    const { themes } = props
    const { size, palette } = themes

    return css`
      flex-grow: 1;
      display: inline-block;
      width: 100%;
      padding: ${size.pxToRem(size.space.XXS)} 0;
      border: none;
      background-color: transparent;
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.TEXT_BLACK};
      line-height: 1.6;
      outline: none;

      &::placeholder {
        color: ${palette.TEXT_GREY};
      }

      &[disabled] {
        color: ${palette.TEXT_DISABLED};
        -webkit-text-fill-color: ${palette.TEXT_DISABLED};
        opacity: 1;
      }
    `
  }}
`
const Prefix = styled.span<{ themes: Theme }>(({ themes }) => {
  const { size } = themes
  return css`
    display: inline-flex;
    align-items: center;
    margin-right: ${size.pxToRem(size.space.XXS)};
  `
})
const Suffix = styled.span<{ themes: Theme }>(({ themes }) => {
  const { size } = themes
  return css`
    display: inline-flex;
    align-items: center;
    margin-left: ${size.pxToRem(size.space.XXS)};
  `
})
