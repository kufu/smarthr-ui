import React, { FC, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { transparentize } from 'polished'

import { Theme, useTheme } from '../../hooks/useTheme'

import { FaCheckIcon, FaMinusIcon } from '../Icon'

export type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  mixed?: boolean
}

export const CheckBox: FC<Props> = ({ mixed = false, className = '', onChange, ...props }) => {
  const theme = useTheme()
  const { checked, disabled } = props
  const boxClassName = `${checked ? 'active' : ''} ${disabled ? 'disabled' : ''}`
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e)
    },
    [onChange],
  )

  return (
    <Wrapper className={className} themes={theme}>
      <Input
        {...props}
        type="checkbox"
        onChange={handleChange}
        themes={theme}
        {...(mixed && { 'aria-checked': 'mixed' })}
      />
      <Box className={boxClassName} themes={theme} />
      {checked && (
        <IconWrap themes={theme}>
          {mixed ? <FaMinusIcon size={10} color="#fff" /> : <FaCheckIcon size={10} color="#fff" />}
        </IconWrap>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes
    return css`
      position: relative;
      display: inline-block;
      width: ${size.pxToRem(16)};
      height: ${size.pxToRem(16)};
      flex-shrink: 0;
      line-height: 1;
      box-sizing: border-box;
    `
  }}
`
const Box = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { frame, palette } = themes
    return css`
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      border: ${frame.border.default};
      background-color: #fff;
      box-sizing: border-box;
      pointer-events: none;
      &.active {
        border-color: ${palette.MAIN};
        background-color: ${palette.MAIN};
      }
      &.disabled {
        background-color: ${palette.BORDER};
        border-color: ${palette.BORDER};
        &.active {
          border-color: ${palette.BORDER};
        }
      }
    `
  }}
`
const Input = styled.input<{ themes: Theme }>`
  ${({ themes }) => {
    const { MAIN, OUTLINE } = themes.palette
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
      &:hover + span {
        box-shadow: 0 0 0 2px ${transparentize(0.78, MAIN)};
      }
      &:focus + span {
        box-shadow: 0 0 0 2px ${OUTLINE};
      }
    `
  }}
`
const IconWrap = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      position: absolute;
      top: 50%;
      left: 50%;
      display: inline-block;
      width: ${size.pxToRem(10)};
      height: ${size.pxToRem(10)};
      transform: translate(-50%, -50%);
      pointer-events: none;
      & > svg {
        vertical-align: top;
      }
    `
  }}
`
