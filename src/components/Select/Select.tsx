import React, { ChangeEvent, SelectHTMLAttributes, VFC, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { isMobileSafari, isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { FaSortIcon } from '../Icon'

type Option = {
  value: string
} & Omit<React.OptionHTMLAttributes<HTMLOptionElement>, 'value'>
type Optgroup = {
  label: string
  options: Option[]
} & React.OptgroupHTMLAttributes<HTMLOptGroupElement>

type Props = {
  options: Array<Option | Optgroup>
  error?: boolean
  width?: number | string
  hasBlank?: boolean
  blankLabel?: string
}

type ElementProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'>

export const Select: VFC<Props & ElementProps> = ({
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
  const widthStyle = typeof width === 'number' ? `${width}px` : width
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (onChange) onChange(e)
    },
    [onChange],
  )
  const classNames = useClassNames()

  return (
    <Wrapper
      className={`${className} ${classNames.wrapper}`}
      $width={widthStyle}
      error={error}
      disabled={props.disabled}
      themes={theme}
    >
      <SelectBox
        onChange={handleChange}
        aria-invalid={error || undefined}
        themes={theme}
        {...props}
      >
        {hasBlank && <option value="">{blankLabel}</option>}
        {options.map((option) => {
          if ('value' in option) {
            return (
              <option key={option.value} {...option}>
                {option.label}
              </option>
            )
          }

          const { options: groupedOptions, ...optgroup } = option

          return (
            <optgroup key={optgroup.label} {...optgroup}>
              {groupedOptions.map((groupedOption) => (
                <option key={groupedOption.value} {...groupedOption}>
                  {groupedOption.label}
                </option>
              ))}
            </optgroup>
          )
        })}
        {
          // Support for not omitting labels in Mobile Safari
          isMobileSafari && <BlankOptgroup />
        }
      </SelectBox>
      <IconWrap>
        <FaSortIcon size={13} />
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
  const { border, radius, color, interaction } = themes
  return css`
    position: relative;
    width: ${$width};
    border-radius: ${radius.m};
    border: ${border.shorthand};
    background-color: #fff;
    box-sizing: border-box;
    transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

    &:hover {
      ${!disabled &&
      css`
        background-color: ${color.hoverColor('#fff')};
      `}
    }
    :focus-within {
      border-color: ${color.MAIN};
    }

    ${error &&
    css`
      border-color: ${color.DANGER} !important;
    `}
    ${disabled &&
    css`
      background-color: ${color.COLUMN};
      color: ${color.TEXT_DISABLED};
    `}
  `
})
const SelectBox = styled.select<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, spacingByChar, radius, color } = themes

    return css`
      display: inline-block;
      width: 100%;
      padding: ${spacingByChar(0.5)};
      padding-right: ${spacingByChar(2)};
      border-radius: ${radius.m};
      border: none;
      background-color: transparent;
      font-size: ${fontSize.M};
      color: ${color.TEXT_BLACK};
      line-height: 1.6;
      outline: none;
      appearance: none;
      cursor: pointer;

      &::placeholder {
        color: ${color.TEXT_GREY};
      }

      &[disabled] {
        pointer-events: none;
        cursor: not-allowed;
        color: ${color.TEXT_DISABLED};
        opacity: 1;
      }

      /* for IE11 */
      &:disabled {
        &,
        &::-ms-value {
          color: ${color.TEXT_DISABLED};
        }
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
