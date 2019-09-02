import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { Icon } from '../Icon'

interface Props {
  checked: boolean
  name: string
  themeColor?: 'light' | 'dark'
  disabled?: boolean
  className?: string
  onChange?: (name: string, checked: boolean) => void
}

class CheckboxComponent extends React.PureComponent<Props & InjectedProps> {
  public render() {
    const {
      checked,
      name,
      disabled = false,
      themeColor = 'light',
      theme,
      className = '',
    } = this.props

    const classNames = `
      ${className} ${checked ? 'active' : ''} ${disabled ? 'disabled' : ''} ${themeColor}
    `

    return (
      <Wrapper className={classNames} theme={theme}>
        {checked && (
          <IconWrap>
            <Icon
              name="fa-check"
              size={12}
              color={themeColor === 'light' ? '#fff' : theme.palette.MAIN}
            />
          </IconWrap>
        )}
        <Input
          type="checkbox"
          checked={checked}
          name={name}
          disabled={disabled}
          onChange={this.handleChange}
        />
      </Wrapper>
    )
  }

  private handleChange = () => {
    const { checked, name, onChange } = this.props
    if (onChange) onChange(name, !checked)
  }
}

export const Checkbox = withTheme(CheckboxComponent)

const Wrapper = styled.div`
  ${({ theme }: InjectedProps) => {
    const { frame, palette } = theme

    return css`
      position: relative;
      display: inline-block;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      border-radius: ${frame.border.radius.s};
      border: ${frame.border.default};
      background-color: #fff;
      line-height: 1;
      box-sizing: border-box;

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
`
const IconWrap = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-block;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);

  & > svg {
    vertical-align: top;
  }
`
