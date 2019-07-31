import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

interface Props {
  checked: boolean
  name: string
  themeColor?: 'light' | 'dark'
  disabled?: boolean
  onChange?: (name: string, checked: boolean) => void
}

class RadioComponent extends React.PureComponent<Props & InjectedProps> {
  public render() {
    const { checked, name, disabled = false, themeColor = 'light', theme } = this.props
    const classNames = `${checked ? 'active' : ''} ${disabled ? 'disabled' : ''} ${themeColor}`

    return (
      <Wrapper className={classNames} theme={theme}>
        <Input
          type="radio"
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

export const Radio = withTheme(RadioComponent)

const Wrapper = styled.div`
  ${({ theme }: InjectedProps) => {
    const { frame, palette } = theme

    return css`
      position: relative;
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: ${frame.border.default};
      background-color: #fff;
      line-height: 1;
      box-sizing: border-box;

      &.active {
        border-color: ${palette.Main};
        background-color: ${palette.Main};

        &::before {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #fff;
          transform: translate(-50%, -50%);
          content: '';
        }
      }

      &.disabled {
        background-color: ${palette.Mono_P10};
        border-color: ${palette.Mono_P10};

        &.active {
          border-color: ${palette.Mono_P10};

          &::before {
            background-color: #fff;
          }
        }
      }

      &.dark {
        border-color: ${palette.Main};

        &.active {
          background-color: #fff;

          &::before {
            background-color: ${palette.Main};
          }
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
