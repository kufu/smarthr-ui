import React, {
  FC,
  FocusEvent,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
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
  thousandsSeparated?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
}

export const Input: FC<Props> = ({
  type,
  onFocus,
  onBlur,
  autoFocus,
  thousandsSeparated,
  prefix,
  suffix,
  ...props
}) => {
  const theme = useTheme()
  const ref = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const isCurrency = type === 'number' && thousandsSeparated
  const actualType = isCurrency ? 'text' : type

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    if (isCurrency && ref.current) {
      const commaExcluded = ref.current.value.replace(/,/g, '')
      ref.current.value = commaExcluded
    }
    onFocus && onFocus(e)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    if (isCurrency && ref.current) {
      const value = ref.current.value
      const shaped = value
        .replace(/[０-９．]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)) // convert number and dot to half-width
        .replace(/[−ー]/, '-') // replace full-width minus
        .replace(/[^0-9.-]|(?!^)-|^\.+|\.+$/g, '') // exclude non-numeric characters
      const splited = shaped.split('.')
      const integerPart = splited[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') // add comma to integer every 3 digits
      const formattedArray = Object.assign(splited, [integerPart])
      ref.current.value = formattedArray.join('.')
    }
    onBlur && onBlur(e)
  }

  useEffect(() => {
    if (autoFocus && ref && ref.current) {
      ref.current.focus()
    }
  }, [autoFocus])

  return (
    <Wrapper
      themes={theme}
      width={props.width}
      isFocused={isFocused}
      disabled={props.disabled}
      error={props.error}
      onClick={() => ref.current?.focus()}
    >
      {prefix && <Prefix themes={theme}>{prefix}</Prefix>}
      <StyledInput
        type={actualType}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
        ref={ref}
        themes={theme}
      />
      {suffix && <Suffix themes={theme}>{suffix}</Suffix>}
    </Wrapper>
  )
}

const Wrapper = styled.span<{
  themes: Theme
  width?: string | number
  isFocused: boolean
  disabled?: boolean
  error?: boolean
}>(({ themes, width = 'auto', isFocused, disabled, error }) => {
  const { frame, palette, size } = themes
  return css`
    display: inline-flex;
    align-items: stretch;
    width: ${typeof width === 'number' ? `${width}px` : width};
    padding: 0 ${size.pxToRem(size.space.XXS)};
    background-color: #fff;
    border-radius: ${frame.border.radius.m};
    border: ${frame.border.default};
    cursor: text;
    ${
      isFocused &&
      css`
        border-color: ${palette.hoverColor(palette.MAIN)};
      `
    }
    ${
      error &&
      css`
        border-color: ${palette.DANGER};
      `
    }
    ${
      disabled &&
      css`
        background-color: ${palette.COLUMN};
        pointer-events: none;
      `
    }
  `
})
const StyledInput = styled.input<Props & { themes: Theme }>`
  ${(props) => {
    const { themes } = props
    const { size, palette } = themes

    return css`
      flex-grow: 1;
      display: inline-block;
      padding: ${size.pxToRem(size.space.XXS)} 0;
      border: none;
      background-color: transparent;
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
