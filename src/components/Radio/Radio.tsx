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
      <Wrapper>
        <Input
          type="radio"
          checked={checked}
          name={name}
          disabled={disabled}
          onChange={this.handleChange}
        />
        <Box className={classNames} theme={theme} />
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
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 1;
`
const Box = styled.span`
  ${({ theme }: InjectedProps) => {
    const { frame, palette } = theme
    return css`
      display: inline-block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: ${frame.border.default};
      background-color: #fff;
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
          pointer-events: none;
        }
      }

      &.disabled {
        background-color: ${palette.Border};
        border-color: ${palette.Border};

        &.active {
          border-color: ${palette.Border};

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

  &:focus + span {
    box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.85); /* FIXME focus style */
  }
`
