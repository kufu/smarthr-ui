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
  /** 選択肢のデータの配列 */
  options: Array<Option<T> | Optgroup<T>>
  /** フォームの値が変わったときに発火するコールバック関数 */
  onChangeValue?: (value: T) => void
  /** フォームの値にエラーがあるかどうか */
  error?: boolean
  /** コンポーネントの幅 */
  width?: number | string
  /** 空の選択肢を表示するかどうか */
  hasBlank?: boolean
  /** 空の選択肢のラベル */
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
    <Wrapper className={`${className} ${classNames.wrapper}`} $width={widthStyle} themes={theme}>
      <SelectBox
        onChange={handleChange}
        aria-invalid={error || undefined}
        themes={theme}
        error={error}
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
        <FaSortIcon />
      </IconWrap>
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  $width: string
  themes: Theme
}>(({ $width, themes: { border, spacingByChar } }) => {
  return css`
    display: flex;
    box-sizing: border-box;
    position: relative;
    width: ${$width};
    min-height: calc(1rem + ${spacingByChar(0.75)} * 2 + ${border.lineWidth} * 2);
  `
})
const SelectBox = styled.select<{
  error?: boolean
  themes: Theme
}>`
  ${({ error, themes }) => {
    const { border, color, fontSize, radius, shadow, spacingByChar } = themes

    return css`
      appearance: none;
      cursor: pointer;
      outline: none;
      border-radius: ${radius.m};
      border: ${border.shorthand};
      background-color: ${color.WHITE};
      padding-right: ${spacingByChar(2)};
      padding-left: ${spacingByChar(0.5)};
      font-size: ${fontSize.M};
      color: ${color.TEXT_BLACK};
      width: 100%;

      ${error &&
      css`
        border-color: ${color.DANGER};
      `}

      &:hover {
        background-color: ${color.hoverColor(color.WHITE)};
      }

      &:focus-visible {
        ${shadow.focusIndicatorStyles}
      }

      &:disabled {
        pointer-events: none;
        opacity: 1;
        background-color: ${color.COLUMN};
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
      ${SelectBox}:focus-visible + & {
        color: ${color.TEXT_BLACK};
      }
    `
  }}
`
const BlankOptgroup = styled.optgroup`
  display: none;
`
