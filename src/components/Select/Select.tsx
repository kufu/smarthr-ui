import React, { ChangeEvent, FC, SelectHTMLAttributes, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { isMobileSafari, isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'

import { FaSortIcon } from '../Icon'

type Option = {
  value: string
} & Omit<React.OptionHTMLAttributes<HTMLOptionElement>, 'value'>
type Optgroup = {
  label: string
  options: Option[]
} & React.OptgroupHTMLAttributes<HTMLOptGroupElement>

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
        {hasBlank && <option value="">{blankLabel}</option>}
        {options.map((option) => {
          if ('value' in option) {
            return <option key={option.value} {...option} />
          }

          const { options: groupedOptions, ...optgroup } = option

          return (
            <optgroup key={optgroup.label} {...optgroup}>
              {groupedOptions.map((groupedOption) => (
                <option key={groupedOption.value} {...groupedOption} />
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
      background-color: ${palette.BASE_GREY};
      color: ${palette.TEXT_DISABLED};
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
