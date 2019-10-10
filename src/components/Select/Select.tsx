import * as React from 'react'
import styled, { css } from 'styled-components'

import { Icon } from '../Icon'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { isTouchDevice } from '../../libs/ua'

interface Option {
  label: string
  value: string
}

interface Props {
  className?: string
  value: string
  name: string
  required?: boolean
  disabled?: boolean
  error?: boolean
  width?: number | string
  options: Option[]
  blankOption?: boolean
  placeholder?: string
  onChange?: (name: string, value: string) => void
}

interface StyledProps extends InjectedProps {
  width: string
}

interface SelectEvent {
  currentTarget: {
    value: string
  }
}

class SelectComponent extends React.PureComponent<Props & InjectedProps> {
  public render() {
    const {
      className = '',
      value,
      name,
      required = false,
      disabled = false,
      error = false,
      width = 260,
      theme,
      options,
      blankOption = false,
      placeholder = '',
    } = this.props
    const widthStyle = typeof width === 'number' ? `${width}px` : width
    const classNames = `${className} ${error ? 'error' : ''}`

    return (
      <Wrapper width={widthStyle} theme={theme}>
        <Base
          className={classNames}
          value={value}
          name={name}
          required={required}
          disabled={disabled}
          onChange={this.handleChange}
          theme={theme}
        >
          {blankOption && <option value=""> {placeholder}</option>}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Base>
        <IconWrap>
          <Icon size={13} name="fa-sort" />
        </IconWrap>
      </Wrapper>
    )
  }

  private handleChange = (e: SelectEvent) => {
    const { name, onChange } = this.props
    const value = e.currentTarget.value
    if (onChange) onChange(name, value)
  }
}

export const Select = withTheme(SelectComponent)

const Wrapper = styled.div`
  ${({ width }: StyledProps) => {
    return css`
      position: relative;
      width: ${width};
    `
  }}
`

const Base = styled.select`
  ${({ theme }: InjectedProps) => {
    const { size, frame, palette, interaction } = theme

    return css`
      display: inline-block;
      width: 100%;
      padding: ${size.pxToRem(size.space.XXS)};
      border-radius: ${frame.border.radius.m};
      border: ${frame.border.default};
      background-color: #fff;
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.TEXT_BLACK};
      line-height: 1.6;
      outline: none;
      box-sizing: border-box;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      text-align: right;

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
