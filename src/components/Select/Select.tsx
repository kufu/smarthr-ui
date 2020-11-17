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
  hasBlank?: boolean
  blankLabel?: string
}

export const Select: FC<Props> = ({
  options,
  onChange,
  error = false,
  width = 260,
  hasBlank = false,
  blankLabel = '選択してください',
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const newOptions = hasBlank ? [{ label: blankLabel, value: '' }, ...options] : options
  const widthStyle = typeof width === 'number' ? `${width}px` : width
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (onChange) onChange(e)
    },
    [onChange],
  )

  return (
    <Wrapper
      className={className}
      $width={widthStyle}
      error={error}
      disabled={props.disabled}
      themes={theme}
    >
      <SelectBox onChange={handleChange} themes={theme} {...props}>
        {newOptions.map((option) => {
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
        {
          // Support for not omitting labels in Mobile Safari
          <BlankOptgroup />
        }
      </SelectBox>
      <IconWrap>
        <Icon size={13} name="fa-sort" />
      </IconWrap>
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  $width: string
  error?: boolean
  disabled?: boolean
  themes: Theme
}>(({ $width, error, disabled, themes }) => {
  const { frame, palette, interaction } = themes
  return css`
    position: relative;
    width: ${$width};
    border-radius: ${frame.border.radius.m};
    border: ${frame.border.default};
    background-color: #fff;
    box-sizing: border-box;
    transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

    &:hover {
      ${!disabled &&
      css`
        background-color: ${palette.hoverColor('#fff')};
      `}
    }
    :focus-within {
      border-color: ${palette.MAIN};
    }

    ${error &&
    css`
      border-color: ${palette.DANGER} !important;
    `}
    ${disabled &&
    css`
      border-color: #f5f5f5;
      background-color: #f5f5f5;
    `}
  `
})
const SelectBox = styled.select<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, frame, palette } = themes

    return css`
      display: inline-block;
      width: 100%;
      padding: ${size.pxToRem(size.space.XXS)};
      padding-right: ${size.pxToRem(size.space.M)};
      border-radius: ${frame.border.radius.m};
      border: none;
      background-color: transparent;
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.TEXT_BLACK};
      line-height: 1.6;
      outline: none;
      appearance: none;
      cursor: pointer;

      &::placeholder {
        color: ${palette.TEXT_GREY};
      }

      &[disabled] {
        pointer-events: none;
        cursor: not-allowed;
        color: ${palette.TEXT_DISABLED};
        opacity: 1;
      }

      &::-ms-expand {
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
const BlankOptgroup = styled.optgroup`
  display: none;
`
