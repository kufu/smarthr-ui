import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { CheckBox, Props as CheckBoxProps } from '../CheckBox'

type Props = CheckBoxProps & {
  label: string
}

const CheckBoxLabelComponent: React.FC<Props & InjectedProps> = ({
  label,
  theme,
  className = '',
  ...props
}) => (
  <Wrapper className={className}>
    <Label className={`${props.disabled ? 'disabled' : ''}`}>
      <CheckBox {...props} />
      <Txt theme={theme}>{label}</Txt>
    </Label>
  </Wrapper>
)

export const CheckBoxLabel = withTheme(CheckBoxLabelComponent)

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
const Txt = styled.p`
  ${({ theme }: InjectedProps) => css`
    margin: 0 0 0 ${theme.size.pxToRem(theme.size.space.XXS)};
    font-size: ${theme.size.pxToRem(theme.size.font.TALL)};
    color: ${theme.palette.TEXT_BLACK};
  `}
`
