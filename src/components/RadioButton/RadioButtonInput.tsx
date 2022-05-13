import React, { ChangeEvent, InputHTMLAttributes, VFC, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { transparentize } from 'polished'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

export type Props = InputHTMLAttributes<HTMLInputElement>

export const RadioButtonInput: VFC<Props> = ({ onChange, ...props }) => {
  const theme = useTheme()
  const { checked, disabled } = props
  const boxClassName = `${checked ? 'active' : ''} ${disabled ? 'disabled' : ''}`
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e)
    },
    [onChange],
  )
  const classNames = useClassNames()

  return (
    <Wrapper themes={theme}>
      <Input
        type="radio"
        onChange={handleChange}
        className={classNames.radioButton}
        themes={theme}
        {...props}
      />
      <Box className={boxClassName} themes={theme} />
    </Wrapper>
  )
}

const Wrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      position: relative;
      display: inline-block;
      flex-shrink: 0;
      width: ${size.pxToRem(16)};
      height: ${size.pxToRem(16)};
      line-height: 1;
    `
  }}
`
const Box = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, border, color } = themes

    return css`
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: ${border.shorthand};
      background-color: ${color.WHITE};
      box-sizing: border-box;

      input:checked + & {
        border-color: ${color.MAIN};
        background-color: ${color.MAIN};

        &::before {
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size.pxToRem(6)};
          height: ${size.pxToRem(6)};
          border-radius: 50%;
          background-color: ${color.WHITE};
          transform: translate(-50%, -50%);
          content: '';
          pointer-events: none;
        }
      }

      input[disabled] + & {
        background-color: ${color.BORDER};
        border-color: ${color.BORDER};
        cursor: not-allowed;

        &.active {
          border-color: ${color.BORDER};

          &::before {
            background-color: ${color.WHITE};
          }
        }
      }
    `
  }}
`
const Input = styled.input<{ themes: Theme }>`
  ${({ themes: { color, shadow } }) => {
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
        box-shadow: ${shadow.focusIndicatorStyles};
      }
    `
  }}
`
