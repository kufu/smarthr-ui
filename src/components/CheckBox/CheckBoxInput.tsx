import React, { VFC, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { transparentize } from 'polished'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { FaCheckIcon, FaMinusIcon } from '../Icon'

export type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  /** `true` のとき、チェック状態を `mixed` にする */
  mixed?: boolean
}

export const CheckBoxInput: VFC<Props> = ({ mixed = false, onChange, ...props }) => {
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

  return (
    <Wrapper themes={theme}>
      <Input
        {...props}
        type="checkbox"
        onChange={handleChange}
        className={classNames.checkBox}
        themes={theme}
        {...(mixed && { 'aria-checked': 'mixed' })}
      />
      <Box className={boxClassName} themes={theme} />
      <IconWrap themes={theme}>
        {mixed ? <FaMinusIcon color="TEXT_WHITE" /> : <FaCheckIcon color="TEXT_WHITE" />}
      </IconWrap>
    </Wrapper>
  )
}

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
const Box = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
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

      input:checked + & {
        border-color: ${color.MAIN};
        background-color: ${color.MAIN};
      }

      input[disabled] + & {
        background-color: ${color.BORDER};
        border-color: ${color.BORDER};
      }
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
      &:hover + span {
        box-shadow: 0 0 0 2px ${transparentize(0.78, color.MAIN)};
      }
      &:focus + span {
        box-shadow: ${shadow.OUTLINE};
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

      input:not(:checked) ~ & > svg {
        fill: transparent;
      }

      & > svg {
        vertical-align: top;
      }
    `
  }}
`
