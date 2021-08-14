import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'
import { useClassNames } from './useClassNames'
import { Leadings } from '../../themes/createLeading'

import { CheckBoxInput, Props as CheckBoxInputProps } from './CheckBoxInput'

type CheckBoxPosition = 'center' | 'top'
type Props = CheckBoxInputProps & {
  checkBoxPosition?: CheckBoxPosition
  lineHeight?: Leadings
  children?: ReactNode
}

export const CheckBox: FC<Props> = ({
  checkBoxPosition = 'center',
  lineHeight = 'TIGHT',
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
        <CheckBoxInput {...props} />
      </Wrapper>
    )

  return (
    <Wrapper checkBoxPosition={checkBoxPosition} className={`${className} ${classNames.wrapper}`}>
      <CheckBoxInput id={checkBoxId} {...props} />

      <Label
        className={`${props.disabled ? 'disabled' : ''} ${classNames.label}`}
        htmlFor={checkBoxId}
        $lineHeight={lineHeight}
        checkBoxPosition={checkBoxPosition}
        themes={theme}
      >
        {children}
      </Label>
    </Wrapper>
  )
}

// Use flex-start to support multi-line text.
const Wrapper = styled.div<{ checkBoxPosition?: CheckBoxPosition }>`
  display: inline-flex;
  align-items: ${({ checkBoxPosition }) => (checkBoxPosition === 'top' ? 'flex-start' : 'center')};
`
const Label = styled.label<{
  themes: Theme
  $lineHeight: Leadings
  checkBoxPosition?: CheckBoxPosition
}>`
  ${({ themes, $lineHeight, checkBoxPosition }) => {
    const { spacingByChar, color, fontSize, leading } = themes

    return css`
      ${checkBoxPosition === 'top' &&
      // top 合わせの場合は CheckBoxInput と line-height の分だけずれるので調整する
      css`
        /* 行の高さ（文字の高さ * line-height）- 文字の高さ / 2 = 差となるハーフレディング */
        margin-top: calc(((1em * ${leading[$lineHeight]}) - 1em) / -2);
      `}
      margin-left: ${spacingByChar(0.5)};
      color: ${color.TEXT_BLACK};
      font-size: ${fontSize.M};
      line-height: ${leading[$lineHeight]};
      cursor: pointer;

      &.disabled {
        color: ${color.TEXT_DISABLED};
        cursor: not-allowed;
        pointer-events: none;
      }
    `
  }}
`
