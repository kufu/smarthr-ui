import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

type Props = {
  type?: 'done' | 'success' | 'process' | 'required' | 'disabled' | 'must' | 'warning' | 'error'
  className?: string
  children: string
}

export const StatusLabel: FC<Props> = ({ type = 'done', className = '', children }) => {
  const theme = useTheme()

  return (
    <Wrapper className={`${type} ${className}`} themes={theme}>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, spacingByChar, palette } = themes

    return css`
      box-sizing: border-box;
      display: inline-block;
      margin: 0;
      border: 1px solid transparent;
      padding: ${spacingByChar(0.25)} ${spacingByChar(0.5)};
      background-color: #fff;
      text-align: center;
      white-space: nowrap;
      min-width: ${size.pxToRem(60)};
      font-size: ${size.pxToRem(size.font.SHORT)};
      font-weight: bold;
      line-height: 1;

      &.done {
        border-color: ${palette.BORDER};
        color: ${palette.TEXT_GREY};
      }

      &.success {
        border-color: ${palette.MAIN};
        color: ${palette.MAIN};
      }

      &.process {
        border-color: ${palette.WARNING};
        color: ${palette.WARNING};
      }

      &.required {
        border-color: ${palette.DANGER};
        color: ${palette.DANGER};
      }

      &.disabled {
        background-color: ${palette.TEXT_GREY};
        color: #fff;
      }

      &.must {
        background-color: ${palette.MAIN};
        color: #fff;
      }

      &.warning {
        background-color: ${palette.WARNING};
        color: #fff;
      }

      &.error {
        background-color: ${palette.DANGER};
        color: #fff;
      }
    `
  }}
`
