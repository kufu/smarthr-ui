import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'
import { useClassNames } from './useClassNames'

import { RadioButtonInput, Props as RadioButtonInputProps } from './RadioButtonInput'

type Props = {
  /** ラベルの行高 */
  lineHeight?: number
  /** ラジオボタンのラベル */
  children?: ReactNode
} & RadioButtonInputProps

export const RadioButton: FC<Props> = ({
  lineHeight = 1.5,
  children,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()
  const radioButtonId = useId(props.id)

  if (!children) {
    return (
      <Wrapper className={`${className} ${classNames.wrapper}`} themes={theme}>
        <RadioButtonInput {...props} className={classNames.radioButton} />
      </Wrapper>
    )
  }

  return (
    <Wrapper className={`${className} ${classNames.wrapper}`} themes={theme}>
      <ButtonLayout $height={`${lineHeight}em`}>
        <RadioButtonInput {...props} id={radioButtonId} />
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
}

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
