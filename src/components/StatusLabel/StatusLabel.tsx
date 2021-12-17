import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = {
  type?: 'done' | 'success' | 'process' | 'required' | 'disabled' | 'must' | 'warning' | 'error'
  className?: string
  children: ReactNode
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
    const { fontSize, size, spacingByChar, color } = themes

    return css`
      box-sizing: border-box;
      display: inline-block;
      margin: 0;
      border: 1px solid transparent;
      padding: ${spacingByChar(0.25)} ${spacingByChar(0.5)};
      background-color: ${color.WHITE};
      text-align: center;
      white-space: nowrap;
      min-width: ${size.pxToRem(60)};
      font-size: ${fontSize.S};
      font-weight: bold;
      line-height: 1;

      &.done {
        border-color: ${color.BORDER};
        color: ${color.TEXT_GREY};
      }

      &.success {
        border-color: ${color.MAIN};
        color: ${color.MAIN};
      }

      &.process {
        border-color: ${color.WARNING};
        color: ${color.WARNING};
      }

      &.required {
        border-color: ${color.DANGER};
        color: ${color.DANGER};
      }

      &.disabled {
        background-color: ${color.TEXT_GREY};
        color: ${color.TEXT_WHITE};
      }

      &.must {
        background-color: ${color.MAIN};
        color: ${color.TEXT_WHITE};
      }

      &.warning {
        background-color: ${color.WARNING};
        color: ${color.TEXT_WHITE};
      }

      &.error {
        background-color: ${color.DANGER};
        color: ${color.TEXT_WHITE};
      }
    `
  }}
`
