import React, { HTMLAttributes, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = {
  type?: 'done' | 'success' | 'process' | 'required' | 'disabled' | 'must' | 'warning' | 'error'
  className?: string
  children: string
}
type ElementProps = Omit<HTMLAttributes<HTMLSpanElement>, keyof Props>

export const StatusLabel: VFC<Props & ElementProps> = ({
  type = 'done',
  className = '',
  children,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper {...props} className={`${type} ${className} ${classNames.wrapper}`} themes={theme}>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, size, spacingByChar, palette } = themes

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
      font-size: ${fontSize.S};
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
