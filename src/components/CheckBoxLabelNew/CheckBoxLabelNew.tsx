import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'
import { useClassNames } from './useClassNames'

import { CheckBox, Props as CheckBoxProps } from '../CheckBox'

type Props = CheckBoxProps & {
  lineHeight?: number
  children?: ReactNode
}

export const CheckBoxLabelNew: FC<Props> = ({
  lineHeight = 1.5,
  className = '',
  children,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()
  const checkBoxId = useId()

  if (!children) return <CheckBox className={`${className} ${classNames.checkBox}`} {...props} />

  return (
    <Wrapper className={`${className} ${classNames.wrapper}`}>
      <Inner>
        <CheckBox id={checkBoxId} className={classNames.checkBox} {...props} />

        <Label
          className={`${props.disabled ? 'disabled' : ''} ${classNames.label}`}
          htmlFor={checkBoxId}
          $lineHeight={lineHeight}
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
// Use flex-start to support multi-line text.
const Inner = styled.div`
  display: flex;
  align-items: flex-start;
`
const Label = styled.label<{ themes: Theme; $lineHeight: number }>`
  ${({ themes, $lineHeight }) => {
    const { spacingByChar, color, fontSize } = themes

    return css`
      margin-left: ${spacingByChar(0.5)};
      color: ${color.TEXT_BLACK};
      font-size: ${fontSize.S};
      line-height: ${$lineHeight};

      &.disabled {
        color: ${color.TEXT_DISABLED};
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Since the positions of checkbox and text are misaligned, create a pseudo element that adjusts the line-height. */
      &::before {
        display: block;
        width: 0;
        height: 0;
        margin-top: calc((1 - ${$lineHeight}) * 0.3em);
        content: '';
      }
    `
  }}
`
