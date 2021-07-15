import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'
import { useClassNames } from './useClassNames'

import { CheckBoxInput, Props as CheckBoxInputProps } from './CheckBoxInput'

type Props = CheckBoxInputProps & {
  lineHeight?: number
  children?: ReactNode
}

export const CheckBoxNew: FC<Props> = ({
  lineHeight = 1.5,
  className = '',
  children,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()
  const checkBoxId = useId(props.id)

  if (!children)
    return (
      <Wrapper className={`${className} ${classNames.wrapper}`}>
        <CheckBoxInput className={classNames.checkBox} {...props} />
      </Wrapper>
    )

  return (
    <Wrapper className={`${className} ${classNames.wrapper}`}>
      <CheckBoxInput id={checkBoxId} className={classNames.checkBox} {...props} />

      <Label
        className={`${props.disabled ? 'disabled' : ''} ${classNames.label}`}
        htmlFor={checkBoxId}
        $lineHeight={lineHeight}
        themes={theme}
      >
        {children}
      </Label>
    </Wrapper>
  )
}

// Use flex-start to support multi-line text.
const Wrapper = styled.div`
  display: inline-flex;
  align-items: flex-start;
`
const Label = styled.label<{ themes: Theme; $lineHeight: number }>`
  ${({ themes, $lineHeight }) => {
    const { spacingByChar, color, fontSize } = themes

    return css`
      margin-left: ${spacingByChar(0.5)};
      color: ${color.TEXT_BLACK};
      font-size: ${fontSize.M};
      line-height: ${$lineHeight};
      cursor: pointer;

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
        margin-top: calc((1 - ${$lineHeight}) * 0.4em);
        content: '';
      }
    `
  }}
`
