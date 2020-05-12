import React, { ChangeEvent, FC, SelectHTMLAttributes, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'

import { Icon } from '../Icon'

type Option = {
  label: string
  value: string
}
type Optgroup = {
  label: string
  options: Option[]
}

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Array<Option | Optgroup>
  error?: boolean
  width?: number | string
}

export const Select: FC<Props> = ({
  options,
  onChange,
  error = false,
  width = 260,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const widthStyle = typeof width === 'number' ? `${width}px` : width
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (onChange) onChange(e)
    },
    [onChange],
  )

  return (
    <Wrapper className={className} width={widthStyle} theme={theme}>
      <SelectBox className={error ? 'error' : ''} onChange={handleChange} themes={theme} {...props}>
        {options.map((option) => {
          if ('value' in option) {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )
          }

          const optgroup: Optgroup = option!

          return (
            <optgroup key={optgroup.label} label={optgroup.label}>
              {optgroup.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          )
        })}
      </SelectBox>
      <IconWrap>
        <Icon size={13} name="fa-sort" />
      </IconWrap>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ width: string }>`
  ${({ width }) => {
    return css`
      position: relative;
      width: ${width};
    `
  }}
`
const SelectBox = styled.select<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, frame, palette, interaction } = themes

    return css`
      display: inline-block;
      width: 100%;
      padding: ${size.pxToRem(size.space.XXS)};
      padding-right: ${size.pxToRem(size.space.M)};
      border-radius: ${frame.border.radius.m};
      border: ${frame.border.default};
      background-color: #fff;
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.TEXT_BLACK};
      line-height: 1.6;
      outline: none;
      box-sizing: border-box;
      appearance: none;
      cursor: pointer;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

      &:hover {
        background-color: ${palette.hoverColor('#fff')};
      }

      &::placeholder {
        color: ${palette.TEXT_GREY};
      }

      &:focus {
        border-color: ${palette.MAIN};
      }

      &.error {
        border-color: ${palette.DANGER};
      }

      &[disabled] {
        border-color: #f5f5f5;
        pointer-events: none;
        cursor: not-allowed;
        background-color: #f5f5f5;
        color: #c1c1c1;
      }

      &:-ms-expand {
        display: none;
      }
    `
  }}
`
const IconWrap = styled.span`
  position: absolute;
  top: 50%;
  right: 6px;
  display: inline-block;
  width: 13px;
  height: 13px;
  transform: translate(-50%, -50%);
  pointer-events: none;

  & > svg {
    vertical-align: top;
  }
`
