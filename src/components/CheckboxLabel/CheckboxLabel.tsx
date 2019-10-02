import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { Checkbox, Props as CheckboxProps } from '../Checkbox'

type Props = CheckboxProps & {
  label: string
}

const CheckboxLabelComponent: React.FC<Props & InjectedProps> = ({
  label,
  theme,
  className = '',
  ...props
}) => (
  <Wrapper className={className}>
    <Label className={`${props.disabled ? 'disabled' : ''}`}>
      <Checkbox {...props} />
      <Txt theme={theme}>{label}</Txt>
    </Label>
  </Wrapper>
)

export const CheckboxLabel = withTheme(CheckboxLabelComponent)

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
