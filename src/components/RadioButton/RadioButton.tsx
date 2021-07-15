import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'
import { useClassNames } from './useClassNames'

import { RadioButtonInput, Props as RadioButtonInputProps } from './RadioButtonInput'

type Props = RadioButtonInputProps & {
  children?: ReactNode
}

export const RadioButton: FC<Props> = ({ children, className = '', ...props }) => {
  const theme = useTheme()
  const classNames = useClassNames()
  const radioButtonId = useId(props.id)

  if (!children) {
    return (
      <Wrapper className={`${className} ${classNames.wrapper}`}>
        <RadioButtonInput className={classNames.radioButton} {...props} />
      </Wrapper>
    )
  }

  return (
    <Wrapper className={`${className} ${classNames.wrapper}`}>
      <RadioButtonInput id={radioButtonId} {...props} />

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
