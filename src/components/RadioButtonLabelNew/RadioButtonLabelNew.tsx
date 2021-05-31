import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'
import { useClassNames } from './useClassNames'

import { RadioButton, Props as RadioButtonProps } from '../RadioButton'

type Props = RadioButtonProps & {
  children?: ReactNode
}

export const RadioButtonLabelNew: FC<Props> = ({ children, className = '', ...props }) => {
  const theme = useTheme()
  const classNames = useClassNames()
  const radioButtonId = useId()

  if (!children) {
    return <RadioButton className={`${className} ${classNames.radioButton}`} {...props} />
  }

  return (
    <Wrapper className={`${className} ${classNames.wrapper}`}>
      <Inner>
        <RadioButton id={radioButtonId} className={classNames.radioButton} {...props} />

        <Label
          htmlFor={radioButtonId}
          className={`${props.disabled ? 'disabled' : ''} ${classNames.label}`}
          themes={theme}
        >
          {children}
        </Label>
      </Inner>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-block;
`
const Inner = styled.div`
  display: flex;
  align-items: center;
`
const Label = styled.label<{ themes: Theme }>`
  ${({ themes }) => {
    const { spacingByChar, fontSize, color } = themes

    return css`
      margin-left: ${spacingByChar(0.5)};
      color: ${color.TEXT_BLACK};
      font-size: ${fontSize.S};
      cursor: pointer;

      &.disabled {
        color: ${color.TEXT_DISABLED};
        cursor: not-allowed;
      }
    `
  }}
`
