import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

type Type = 'done' | 'success' | 'process' | 'required' | 'disabled' | 'must' | 'warning' | 'error'

interface Props {
  type?: Type
  className?: string
  children: string
}

type MergedProps = Props & InjectedProps

const StatusLabelComponent: React.FC<MergedProps> = ({
  type = 'done',
  className = '',
  children,
  theme,
}) => {
  return (
    <Wrapper theme={theme} className={`${type} ${className}`}>
      {children}
    </Wrapper>
  )
}

const BorderStyle = css`
  ${({ theme }: InjectedProps) => {
    return css`
      border: ${theme.frame.border.default};
    `
  }}
`

const FillStyle = css`
  ${({ theme }: InjectedProps) => {
    return css`
      background-color: ${theme.palette.BORDER};
      color: #fff;
    `
  }}
`

const Wrapper = styled.span`
  ${({ theme }: InjectedProps) => {
    return css`
      height: ${theme.size.pxToRem(20)};
      box-sizing: border-box;
      margin: 0;
      padding: 0 ${theme.size.pxToRem(theme.size.space.XXS)};
      display: inline-block;
      white-space: nowrap;
      font-size: ${theme.size.pxToRem(theme.size.font.SHORT)};
      font-weight: bold;
      line-height: ${theme.size.pxToRem(20)};

      &.done {
        ${BorderStyle}
        border-color: ${theme.palette.BORDER};
        color: ${theme.palette.TEXT_GREY};
      }

      &.success {
        ${BorderStyle}
        border-color: ${theme.palette.MAIN};
        color: ${theme.palette.MAIN};
      }

      &.process {
        ${BorderStyle}
        border-color: ${theme.palette.WARNING};
        color: ${theme.palette.WARNING};
      }

      &.required {
        ${BorderStyle}
        border-color: ${theme.palette.DANGER};
        color: ${theme.palette.DANGER};
      }

      &.disabled {
        ${FillStyle}
        background-color: ${theme.palette.TEXT_GREY};
      }

      &.must {
        ${FillStyle}
        background-color: ${theme.palette.MAIN};
      }

      &.warning {
        ${FillStyle}
        background-color: ${theme.palette.WARNING};
      }

      &.error {
        ${FillStyle}
        background-color: ${theme.palette.DANGER};
      }
    `
  }}
`

export const StatusLabel = withTheme(StatusLabelComponent)
