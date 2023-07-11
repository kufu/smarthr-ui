import { transparentize } from 'polished'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { FaCheckIcon, FaMinusIcon } from '../Icon'

import { useClassNames } from './useClassNames'

export type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  /** `true` のとき、チェック状態を `mixed` にする */
  mixed?: boolean
  /** チェックボックスにエラーがあるかどうか */
  error?: boolean
}

export const CheckBoxInput = forwardRef<HTMLInputElement, Props>(
  ({ mixed = false, onChange, ...props }, ref) => {
    const theme = useTheme()
    const { checked, disabled } = props
    const boxClassName = `${checked ? 'active' : ''} ${disabled ? 'disabled' : ''}`
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e)
      },
      [onChange],
    )
    const classNames = useClassNames()

    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current,
    )

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = !!(checked && mixed)
      }
    }, [checked, mixed])

    return (
      <Wrapper themes={theme}>
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
        <Input
          {...props}
          type="checkbox"
          onChange={handleChange}
          className={classNames.checkBox}
          themes={theme}
          ref={inputRef}
          aria-invalid={props.error || undefined}
        />
        <Box className={boxClassName} themes={theme} error={props.error} />
        <IconWrap themes={theme}>
          {mixed ? <FaMinusIcon color="TEXT_WHITE" /> : <FaCheckIcon color="TEXT_WHITE" />}
        </IconWrap>
      </Wrapper>
    )
  },
)

const Wrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize } = themes

    return css`
      position: relative;
      display: inline-block;
      width: ${fontSize.M};
      height: ${fontSize.M};
      flex-shrink: 0;
      line-height: 1;
      box-sizing: border-box;
    `
  }}
`
const Box = styled.span<{ themes: Theme; error?: boolean }>`
  ${({ themes, error }) => {
    const { border, color } = themes
    return css`
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      border: ${border.shorthand};
      background-color: ${color.WHITE};
      box-sizing: border-box;
      pointer-events: none;

      @media (prefers-contrast: more) {
        & {
          border: ${border.highContrast};
        }
      }

      /* FIXME: なぜか static classname になってしまうため & を重ねている */
      input:checked + &&,
      input:indeterminate + && {
        border-color: ${color.MAIN};
        background-color: ${color.MAIN};
        @media (prefers-contrast: more) {
          & {
            border: ${border.highContrast};
          }
        }
      }

      /* FIXME: なぜか static classname になってしまうため & を重ねている */
      input[disabled] + && {
        background-color: ${color.BORDER};
        border-color: ${color.BORDER};
      }

      ${error &&
      css`
        border-color: ${color.DANGER};
      `}
    `
  }}
`
const Input = styled.input<{ themes: Theme }>`
  ${({ themes }) => {
    const { shadow, color } = themes
    return css`
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      cursor: pointer;
      &[disabled] {
        pointer-events: none;
      }
      &:hover:not([disabled]) + span {
        box-shadow: 0 0 0 2px ${transparentize(0.78, color.MAIN)};
      }
      &:focus-visible + span {
        ${shadow.focusIndicatorStyles};
      }
    `
  }}
`
const IconWrap = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize } = themes

    return css`
      position: absolute;
      top: 50%;
      left: 50%;
      display: inline-block;
      width: ${fontSize.XXS};
      height: ${fontSize.XXS};
      font-size: ${fontSize.XXS};
      transform: translate(-50%, -50%);
      pointer-events: none;

      input:not(:checked, :indeterminate) ~ & > svg {
        fill: transparent;
      }

      & > svg {
        vertical-align: top;
      }
    `
  }}
`
