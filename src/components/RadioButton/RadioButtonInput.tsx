import { transparentize } from 'polished'
import React, { ChangeEvent, InputHTMLAttributes, forwardRef, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { useClassNames } from './useClassNames'

export type Props = InputHTMLAttributes<HTMLInputElement>

export const RadioButtonInput = forwardRef<HTMLInputElement, Props>(
  ({ onChange, ...props }, ref) => {
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
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
        <Input
          {...props}
          type="radio"
          onChange={handleChange}
          className={classNames.radioButton}
          themes={theme}
          ref={ref}
        />
        <Box className={boxClassName} themes={theme} />
      </Wrapper>
    )
  },
)

const Wrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { leading } = themes

    return css`
      position: relative;
      display: inline-block;
      flex-shrink: 0;
      width: 1em;
      height: 1em;
      line-height: ${leading.NONE};
    `
  }}
`
const Box = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { border, color } = themes

    return css`
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: ${border.shorthand};
      background-color: ${color.WHITE};
      box-sizing: border-box;

      @media (prefers-contrast: more) {
        & {
          border: ${border.highContrast};
        }
      }

      /* FIXME: なぜか static classname になってしまうため & を重ねている */
      input:checked + && {
        border-color: ${color.MAIN};
        background-color: ${color.MAIN};

        @media (prefers-contrast: more) {
          & {
            border: ${border.highContrast};
          }
        }

        &::before {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0.375em;
          height: 0.375em;
          border-radius: 50%;
          background-color: ${color.WHITE};
          transform: translate(-50%, -50%);
          content: '';
          pointer-events: none;
        }
      }

      /* FIXME: なぜか static classname になってしまうため & を重ねている */
      input[disabled] + && {
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
  ${({ themes: { color, shadow } }) => css`
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
    `}
`
