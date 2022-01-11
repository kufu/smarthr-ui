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
  type?: HTMLInputElement['type']
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
          <Affix themes={theme} className={classNames.prefix}>
            {prefix}
          </Affix>
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
          <Affix themes={theme} className={classNames.suffix}>
            {suffix}
          </Affix>
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
  const { border, color, radius, shadow, spacingByChar } = themes
  return css`
    cursor: text;
    box-sizing: border-box;
    display: inline-flex;
    gap: ${spacingByChar(0.5)};
    align-items: center;
    border-radius: ${radius.m};
    border: ${border.shorthand};
    background-color: ${color.WHITE};
    padding-right: ${spacingByChar(0.5)};
    padding-left: ${spacingByChar(0.5)};
    width: ${typeof $width === 'number' ? `${$width}px` : $width};

    &:focus-within {
      box-shadow: ${shadow.OUTLINE};
    }

    ${!$disabled &&
    error &&
    css`
      border-color: ${color.DANGER};
    `}
    ${$disabled &&
    css`
      pointer-events: none;
      background-color: ${color.hoverColor(color.WHITE)};
    `}
  `
})
const StyledInput = styled.input<Props & { themes: Theme }>(
  ({ themes: { fontSize, leading, color, radius, spacingByChar } }) =>
    css`
      flex-grow: 1;

      display: inline-block;
      outline: none;
      border-radius: ${radius.m};
      border: none;
      background-color: transparent;
      padding: ${spacingByChar(0.75)} 0;
      font-size: ${fontSize.M};
      line-height: ${leading.NONE};
      color: ${color.TEXT_BLACK};
      width: 100%;

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
    `,
)
const Affix = styled.span<{ themes: Theme }>(
  ({ themes: { color } }) => css`
    flex-shrink: 0;

    display: flex;
    align-items: center;
    color: ${color.TEXT_GREY};
  `,
)
