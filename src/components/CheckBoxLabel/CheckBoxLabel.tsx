import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { CheckBox, Props as CheckBoxProps } from '../CheckBox'
import { Theme, useTheme } from '../../hooks/useTheme'

type Props = CheckBoxProps & {
  label: string
}

export const CheckBoxLabel: FC<Props> = ({ label, className = '', ...props }) => {
  const theme = useTheme()

  return (
    <Wrapper className={className}>
      <Label className={`${props.disabled ? 'disabled' : ''}`} themes={theme}>
        <CheckBox {...props} />
        <Txt themes={theme}>{label}</Txt>
      </Label>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-block;
`
const Label = styled.label<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette } = themes
    return css`
      display: flex;
      align-items: center;
      color: ${palette.TEXT_BLACK};
      cursor: pointer;

      &.disabled {
        color: ${palette.TEXT_DISABLED};
        cursor: default;
        pointer-events: none;
      }
    `
  }}
`
const Txt = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes
    return css`
      margin: 0 0 0 ${size.pxToRem(size.space.XXS)};
      font-size: ${size.pxToRem(size.font.TALL)};
    `
  }}
`
