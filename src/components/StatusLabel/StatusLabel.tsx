import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

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

const borderStyle = (border: string) => css`
  border: ${border};
  background-color: #fff;
`
const fillStyle = (backgroundColor: string) => css`
  background-color: ${backgroundColor};
  color: #fff;
`
const Wrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, frame, palette } = themes

    return css`
      height: ${size.pxToRem(20)};
      box-sizing: border-box;
      margin: 0;
      padding: 0 ${size.pxToRem(size.space.XXS)};
      display: inline-block;
      white-space: nowrap;
      font-size: ${size.pxToRem(size.font.SHORT)};
      font-weight: bold;
      line-height: calc(${size.pxToRem(20)} - ${frame.border.lineWidth} * 2);

      &.done {
        ${borderStyle(frame.border.default)}
        border-color: ${palette.BORDER};
        color: ${palette.TEXT_GREY};
      }

      &.success {
        ${borderStyle(frame.border.default)}
        border-color: ${palette.MAIN};
        color: ${palette.MAIN};
      }

      &.process {
        ${borderStyle(frame.border.default)}
        border-color: ${palette.WARNING};
        color: ${palette.WARNING};
      }

      &.required {
        ${borderStyle(frame.border.default)}
        border-color: ${palette.DANGER};
        color: ${palette.DANGER};
      }

      &.disabled {
        ${fillStyle(palette.BORDER)}
        background-color: ${palette.TEXT_GREY};
      }

      &.must {
        ${fillStyle(palette.BORDER)}
        background-color: ${palette.MAIN};
      }

      &.warning {
        ${fillStyle(palette.BORDER)}
        background-color: ${palette.WARNING};
      }

      &.error {
        ${fillStyle(palette.BORDER)}
        background-color: ${palette.DANGER};
      }
    `
  }}
`
