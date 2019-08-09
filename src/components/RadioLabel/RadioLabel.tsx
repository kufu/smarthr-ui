import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { Radio } from '../Radio'

interface Props {
  label: string
  checked: boolean
  name: string
  themeColor?: 'light' | 'dark'
  disabled?: boolean
  onChange?: (name: string, checked: boolean) => void
}

const RadioLabelComponent: React.FC<Props & InjectedProps> = ({ label, theme, ...props }) => (
  <Wrapper>
    <Label className={`${props.disabled ? 'disabled' : ''}`}>
      <Radio {...props} />
      <Txt theme={theme}>{label}</Txt>
    </Label>
  </Wrapper>
)

export const RadioLabel = withTheme(RadioLabelComponent)

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
