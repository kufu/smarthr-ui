import React, { ChangeEvent, SelectHTMLAttributes, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { isMobileSafari } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { FaSortIcon } from '../Icon'

type Option<T extends string> = {
  value: T
} & Omit<React.OptionHTMLAttributes<HTMLOptionElement>, 'value'>
type Optgroup<T extends string> = {
  label: string
  options: Array<Option<T>>
} & React.OptgroupHTMLAttributes<HTMLOptGroupElement>

type Props<T extends string> = {
  options: Array<Option<T> | Optgroup<T>>
  onChangeValue?: (value: T) => void
  error?: boolean
  width?: number | string
  hasBlank?: boolean
  blankLabel?: string
}

type ElementProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'>

export function Select<T extends string>({
  options,
  onChange,
  onChangeValue,
  error = false,
  width = '16.25em',
  hasBlank = false,
  blankLabel = '選択してください',
  className = '',
  disabled,
  ...props
}: Props<T> & ElementProps) {
  const theme = useTheme()
  const widthStyle = typeof width === 'number' ? `${width}px` : width
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (onChange) onChange(e)
      if (onChangeValue) {
        const flattenOptions = options.reduce(
          (pre, cur) => pre.concat('value' in cur ? cur : cur.options),
          [] as Array<Option<T>>,
        )
        const selectedOption = flattenOptions.find((option) => option.value === e.target.value)
        if (selectedOption) {
          onChangeValue(selectedOption.value)
        }
      }
    },
    [onChange, onChangeValue, options],
  )
  const classNames = useClassNames()

  return (
    <Wrapper
      className={`${className} ${classNames.wrapper}`}
      $width={widthStyle}
      error={error}
      disabled={disabled}
      themes={theme}
    >
      <SelectBox
        onChange={handleChange}
        aria-invalid={error || undefined}
        themes={theme}
        disabled={disabled}
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
      <IconWrap themes={theme}>
        <FaSortIcon color="inherit" />
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
  const { border, color, radius, shadow } = themes
  return css`
    box-sizing: border-box;
    position: relative;
    border-radius: ${radius.m};
    border: ${border.shorthand};
    background-color: ${color.WHITE};
    width: ${$width};

    &:hover {
      ${!disabled &&
      css`
        background-color: ${color.hoverColor(color.WHITE)};
      `}
    }
    &:focus-within {
      ${shadow.focusIndicatorStyles}
    }

    ${error &&
    css`
      border-color: ${color.DANGER};
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
    const { color, fontSize, leading, spacingByChar } = themes

    return css`
      appearance: none;
      cursor: pointer;
      display: inline-block;
      outline: none;
      border: none;
      background-color: transparent;
      padding: ${spacingByChar(0.75)};
      padding-right: ${spacingByChar(2)};
      padding-left: ${spacingByChar(0.5)};
      font-size: ${fontSize.M};
      color: ${color.TEXT_BLACK};
      line-height: ${leading.NONE};
      width: 100%;

      &::placeholder {
        color: ${color.TEXT_GREY};
      }

      &[disabled] {
        pointer-events: none;
        cursor: not-allowed;
        opacity: 1;
        color: ${color.TEXT_DISABLED};
      }
    `
  }}
`
const IconWrap = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { color, spacingByChar } = themes

    return css`
      pointer-events: none;
      position: absolute;
      top: 0;
      right: ${spacingByChar(0.75)};
      bottom: 0;
      display: inline-flex;
      align-items: center;
      color: ${color.TEXT_GREY};

      ${SelectBox}:disabled + & {
        color: ${color.TEXT_DISABLED};
      }
      ${SelectBox}:focus + & {
        color: ${color.TEXT_BLACK};
      }
    `
  }}
`
const BlankOptgroup = styled.optgroup`
  display: none;
`
