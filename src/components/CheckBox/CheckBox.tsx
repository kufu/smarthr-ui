import React, { FC, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { transparentize } from 'polished'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { Icon } from '../Icon'

export type Props = {
  checked: boolean
  name: string
  themeColor?: 'light' | 'dark'
  disabled?: boolean
  mixed?: boolean
  className?: string
  onChange?: (name: string, checked: boolean) => void
}

const CheckBoxComponent: FC<Props & InjectedProps> = ({
  checked,
  name,
  disabled = false,
  themeColor = 'light',
  mixed = false,
  className = '',
  onChange,
  theme,
}) => {
  const boxClassName = `${checked ? 'active' : ''} ${disabled ? 'disabled' : ''} ${themeColor}`
  const handleChange = useCallback(() => {
    if (onChange) onChange(name, !checked)
  }, [checked, name, onChange])

  return (
    <Wrapper theme={theme} className={className}>
      <Input
        type="checkbox"
        checked={checked}
        name={name}
        disabled={disabled}
        theme={theme}
        onChange={handleChange}
      />
      <Box className={boxClassName} theme={theme} />
      {checked && (
        <IconWrap>
          <Icon
            name={mixed ? 'fa-minus' : 'fa-check'}
            size={12}
            color={themeColor === 'light' ? '#fff' : theme.palette.MAIN}
          />
        </IconWrap>
      )}
    </Wrapper>
  )
}

export const CheckBox = withTheme(CheckBoxComponent)

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  line-height: 1;
  box-sizing: border-box;
`
const Box = styled.span`
  ${({ theme }: InjectedProps) => {
    const { frame, palette } = theme
    return css`
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: ${frame.border.radius.s};
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
      &.dark {
        border-color: ${palette.MAIN};
        &.active {
          background-color: #fff;
        }
      }
    `
  }}
`
const Input = styled.input`
  ${({ theme }: InjectedProps) => {
    const { palette } = theme
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
        box-shadow: 0 0 0 2px ${transparentize(0.78, palette.MAIN)};
      }
      &:focus + span {
        box-shadow: 0 0 0 2px ${palette.OUTLINE};
      }
    `
  }}
`

const IconWrap = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-block;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  & > svg {
    vertical-align: top;
  }
`
