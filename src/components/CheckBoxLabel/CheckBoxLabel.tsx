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
      <Label className={`${props.disabled ? 'disabled' : ''}`}>
        <CheckBox {...props} />
        <Txt themes={theme}>{label}</Txt>
      </Label>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-block;
`
const Label = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;

  &.disabled {
    cursor: default;
  }
`
const Txt = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes
    return css`
      margin: 0 0 0 ${size.pxToRem(size.space.XXS)};
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.TEXT_BLACK};
    `
  }}
`
