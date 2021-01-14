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
    const prefixRef = useRef<HTMLSpanElement>(null)
    const suffixRef = useRef<HTMLScriptElement>(null)
    const [prefixWidth, setPrefixWidth] = useState(0)
    const [suffixWidth, setSuffixWidth] = useState(0)

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

    useLayoutEffect(() => {
      if (prefixRef.current) {
        setPrefixWidth(prefixRef.current.clientWidth)
      }
      if (suffixRef.current) {
        setSuffixWidth(suffixRef.current.clientWidth)
      }
    }, [])

    return (
      <Wrapper
        themes={theme}
        $width={width}
        isFocused={isFocused}
        $disabled={props.disabled}
        error={props.error}
        onClick={() => innerRef.current?.focus()}
        className={className}
      >
        {prefix && (
          <Prefix themes={theme} ref={prefixRef}>
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
        />
        {suffix && (
          <Suffix themes={theme} ref={suffixRef}>
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
  isFocused: boolean
  $disabled?: boolean
  error?: boolean
}>(({ themes, $width = 'auto', isFocused, $disabled, error }) => {
  const { frame, palette } = themes
  return css`
    position: relative;
    display: inline-flex;
    align-items: stretch;
    width: ${typeof $width === 'number' ? `${$width}px` : $width};
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
    ${$disabled &&
    css`
      background-color: ${palette.COLUMN};
      pointer-events: none;
    `}
  `
})
const StyledInput = styled.input<
  Props & { prefixWidth: number; suffixWidth: number; themes: Theme }
>`
  ${(props) => {
    const { prefixWidth, suffixWidth, themes } = props
    const { size, palette, frame } = themes

    return css`
      flex-grow: 1;
      display: inline-block;
      width: 100%;
      padding-top: ${size.pxToRem(size.space.XXS)};
      padding-bottom: ${size.pxToRem(size.space.XXS)};
      padding-left: ${size.pxToRem(size.space.XXS + prefixWidth)};
      padding-right: ${size.pxToRem(size.space.XXS + suffixWidth)};
      border: none;
      border-radius: ${frame.border.radius.m};
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.TEXT_BLACK};
      line-height: 1.6;
      outline: none;
      box-sizing: border-box;

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
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding-left: ${size.pxToRem(size.space.XXS)};
  `
})
const Suffix = styled.span<{ themes: Theme }>(({ themes }) => {
  const { size } = themes
  return css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding-right: ${size.pxToRem(size.space.XXS)};
  `
})
