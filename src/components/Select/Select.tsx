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
  /** コンポーネントの大きさ */
  size?: 'default' | 's'
}

type ElementProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, keyof Props<string> | 'children'>

export function Select<T extends string>({
  options,
  onChange,
  onChangeValue,
  error = false,
  width = '16.25em',
  hasBlank = false,
  blankLabel = '選択してください',
  size = 'default',
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
      className={`${className} ${classNames.wrapper} ${generateSizeClassName(size)}`}
      $width={widthStyle}
    >
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

const generateSizeClassName = (size: Props<string>['size']) => (size === 's' ? '--small' : '')

const Wrapper = styled.div<{
  $width: string
}>`
  ${({ $width }) => css`
    position: relative;
    box-sizing: border-box;
    width: ${$width};
  `}
`
const SelectBox = styled.select<{
  error?: boolean
  themes: Theme
}>`
  ${({ error, themes: { border, color, fontSize, leading, radius, shadow, spacingByChar } }) => css`
    appearance: none;
    cursor: pointer;
    outline: none;
    border-radius: ${radius.m};
    border: ${border.shorthand};
    background-color: ${color.WHITE};
    padding-inline: ${spacingByChar(0.5)} ${spacingByChar(2)};
    font-size: ${fontSize.M};
    line-height: ${leading.NONE};
    color: ${color.TEXT_BLACK};
    width: 100%;

    /* padding に依る積み上げでは文字が見切れてしまうため */
    min-height: calc(${fontSize.M} + ${spacingByChar(0.75)} * 2 + ${border.lineWidth} * 2);

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
      border-color: ${color.disableColor(color.BORDER)};
      background-color: ${color.hoverColor(color.WHITE)};
      color: ${color.TEXT_DISABLED};
    }

    .--small & {
      padding-inline: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};

      /* padding に依る積み上げでは文字が見切れてしまうため */
      min-height: calc(${fontSize.S} + ${spacingByChar(0.5)} * 2 + ${border.lineWidth} * 2);
    }
  `}
`
const IconWrap = styled.span<{ themes: Theme }>`
  ${({ themes: { color, fontSize, spacingByChar } }) => css`
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

    .--small & {
      right: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};
    }
  `}
`
const BlankOptgroup = styled.optgroup`
  display: none;
`
