import React, { FC, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

export type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  themeColor?: 'light' | 'dark'
}

const RadioButtonComponent: FC<Props & InjectedProps> = ({
  themeColor = 'light',
  className = '',
  onChange,
  theme,
  ...props
}) => {
  const { checked, disabled } = props
  const boxClassName = `${checked ? 'active' : ''} ${disabled ? 'disabled' : ''} ${themeColor}`
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e)
    },
    [onChange],
  )

  return (
    <Wrapper className={className}>
      <Input type="radio" theme={theme} onChange={handleChange} {...props} />
      <Box className={boxClassName} theme={theme} />
    </Wrapper>
  )
}

export const RadioButton = withTheme(RadioButtonComponent)

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
        border-color: ${palette.MAIN};
        background-color: ${palette.MAIN};

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
        background-color: ${palette.BORDER};
        border-color: ${palette.BORDER};

        &.active {
          border-color: ${palette.BORDER};

          &::before {
            background-color: #fff;
          }
        }
      }

      &.dark {
        border-color: ${palette.MAIN};

        &.active {
          background-color: #fff;

          &::before {
            background-color: ${palette.MAIN};
          }
        }
      }
    `
  }}
`
const Input = styled.input`
  ${({ theme }: InjectedProps) => {
    const { palette } = theme
    return css`
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
        box-shadow: 0 0 0 2px ${palette.OUTLINE};
      }
    `
  }}
`
