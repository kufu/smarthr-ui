import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { RadioButton, Props as RadioButtonProps } from '../RadioButton'

type Props = RadioButtonProps & {
  children?: ReactNode
}

export const RadioButtonLabelNew: FC<Props> = ({ children, className = '', ...props }) => {
  const theme = useTheme()

  if (!children) return <RadioButton className={className} {...props} />

  return (
    <Wrapper className={className}>
      <Label className={props.disabled ? 'disabled' : ''} themes={theme}>
        <RadioButton {...props} />
        <Txt themes={theme}>{children}</Txt>
      </Label>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-block;
`
const Label = styled.label<{ themes: Theme }>`
  ${({ themes }) => {
    const { color } = themes

    return css`
      display: flex;
      align-items: center;
      color: ${color.TEXT_BLACK};
      cursor: pointer;

      &.disabled {
        color: ${color.TEXT_DISABLED};
        cursor: default;
      }
    `
  }}
`
const Txt = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, spacingByChar } = themes

    return css`
      margin: 0 0 0 ${spacingByChar(0.5)};
      font-size: ${fontSize.M};
    `
  }}
`
