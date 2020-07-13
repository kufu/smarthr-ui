import React, { ChangeEvent, FC, InputHTMLAttributes, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

export type Props = InputHTMLAttributes<HTMLInputElement>

export const RadioButton: FC<Props> = ({ className = '', onChange, ...props }) => {
  const theme = useTheme()
  const { checked, disabled } = props
  const boxClassName = `${checked ? 'active' : ''} ${disabled ? 'disabled' : ''}`
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e)
    },
    [onChange],
  )

  return (
    <Wrapper className={className} themes={theme}>
      <Input type="radio" onChange={handleChange} themes={theme} {...props} />
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
    const { size, frame, palette } = themes

    return css`
      display: inline-block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: ${frame.border.default};
      background-color: #fff;
      box-sizing: border-box;

      &.active {
        border-color: ${palette.MAIN};
        background-color: ${palette.MAIN};

        &::before {
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size.pxToRem(6)};
          height: ${size.pxToRem(6)};
          border-radius: 50%;
          background-color: #fff;
          transform: translate(-50%, -50%);
          content: '';
          pointer-events: none;
        }
      }

      &.disabled {
        background-color: ${palette.BORDER};
        border-color: ${palette.BORDER};

        &.active {
          border-color: ${palette.BORDER};

          &::before {
            background-color: #fff;
          }
        }
      }
    `
  }}
`
const Input = styled.input<{ themes: Theme }>`
  ${({ themes }) => {
    const { OUTLINE } = themes.palette

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

      &:focus + span {
        box-shadow: 0 0 0 2px ${OUTLINE};
      }
    `
  }}
`
