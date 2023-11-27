import React, { ReactNode, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { CheckBox, Props as CheckBoxProps } from '../CheckBox'
import { Center } from '../Layout'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { Td as shrTd } from './Td'

type Props = {
  /** 値を特定するための行 id */
  'aria-labelledby': string
  /** aria-labelledby では特定できない場合に補足するための不可視ラベル */
  children?: ReactNode
}

export const TdCheckbox = forwardRef<HTMLInputElement, Omit<CheckBoxProps, keyof Props> & Props>(
  ({ 'aria-labelledby': ariaLabelledby, children, className, ...others }, ref) => {
    const theme = useTheme()
    return (
      // Td に必要な属性やイベントは不要
      <Td className={className} themes={theme}>
        <Label>
          {/* 使う側で lint をかけるため無効化 */}
          {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute  */}
          <CheckBox {...others} ref={ref} aria-labelledby={ariaLabelledby} />
          {children && <VisuallyHiddenText>{children}</VisuallyHiddenText>}
        </Label>
      </Td>
    )
  },
)

const Td = styled(shrTd)<{ themes: Theme }>`
  ${({ themes: { fontSize, space } }) => css`
    position: relative;
    padding: ${space(0.75)};
    width: ${fontSize.M};
  `}
`
const Label = styled(Center).attrs({ forwardedAs: 'label', verticalCentering: true })`
  position: absolute;
  inset: 0;

  &:not(:has([disabled])) {
    cursor: pointer;
  }
`
