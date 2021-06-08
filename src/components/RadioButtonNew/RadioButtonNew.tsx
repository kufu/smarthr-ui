import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'
import { useClassNames } from './useClassNames'

import { RadioButton, Props as RadioButtonProps } from '../RadioButton'

type Props = RadioButtonProps & {
  children?: ReactNode
}

export const RadioButtonNew: FC<Props> = ({ children, className = '', ...props }) => {
  const theme = useTheme()
  const classNames = useClassNames()
  const radioButtonId = useId(props.id)

  if (!children) {
    return (
      <Wrapper className={`${className} ${classNames.wrapper}`}>
        <RadioButton className={classNames.radioButton} {...props} />
      </Wrapper>
    )
  }

  return (
    <Wrapper className={`${className} ${classNames.wrapper}`}>
      <RadioButton id={radioButtonId} className={classNames.radioButton} {...props} />

      <Label
        htmlFor={radioButtonId}
        className={`${props.disabled ? 'disabled' : ''} ${classNames.label}`}
        themes={theme}
      >
        {children}
      </Label>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
`
const Label = styled.label<{ themes: Theme }>`
  ${({ themes }) => {
    const { spacingByChar, fontSize, color } = themes

    return css`
      margin-left: ${spacingByChar(0.5)};
      color: ${color.TEXT_BLACK};
      font-size: ${fontSize.M};
      cursor: pointer;

      &.disabled {
        color: ${color.TEXT_DISABLED};
        cursor: not-allowed;
      }
    `
  }}
`
