import React, { ReactNode, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { useId } from '../../hooks/useId'
import { Theme, useTheme } from '../../hooks/useTheme'

import { RadioButtonInput, Props as RadioButtonInputProps } from './RadioButtonInput'
import { useClassNames } from './useClassNames'

type Props = {
  /** ラベルの行高 */
  lineHeight?: number
  /** ラジオボタンのラベル */
  children?: ReactNode
} & RadioButtonInputProps

export const RadioButton = forwardRef<HTMLInputElement, Props>(
  ({ lineHeight = 1.5, children, className = '', ...props }, ref) => {
    const theme = useTheme()
    const classNames = useClassNames()
    const radioButtonId = useId(props.id)

    if (!children) {
      return (
        <Wrapper className={`${className} ${classNames.wrapper}`} themes={theme}>
          {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
          <RadioButtonInput {...props} ref={ref} className={classNames.radioButton} />
        </Wrapper>
      )
    }

    return (
      <Wrapper className={`${className} ${classNames.wrapper}`} themes={theme}>
        <ButtonLayout $height={`${lineHeight}em`}>
          {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
          <RadioButtonInput {...props} ref={ref} id={radioButtonId} />
        </ButtonLayout>

        <Label
          htmlFor={radioButtonId}
          className={`${props.disabled ? 'disabled' : ''} ${classNames.label}`}
          $lineHeight={lineHeight}
          themes={theme}
        >
          {children}
        </Label>
      </Wrapper>
    )
  },
)

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes: { fontSize } }) => css`
    display: inline-flex;
    align-items: start;
    font-size: ${fontSize.M};
  `}
`
const ButtonLayout = styled.div<{ $height: string }>`
  ${({ $height }) => css`
    display: flex;
    align-items: center;
    height: ${$height};
  `}
`
const Label = styled.label<{ themes: Theme; $lineHeight: number }>`
  ${({ themes, $lineHeight }) => {
    const { spacingByChar, color } = themes

    return css`
      margin-left: ${spacingByChar(0.5)};
      color: ${color.TEXT_BLACK};
      line-height: ${$lineHeight};
      cursor: pointer;

      &.disabled {
        color: ${color.TEXT_DISABLED};
        cursor: not-allowed;
      }
    `
  }}
`
