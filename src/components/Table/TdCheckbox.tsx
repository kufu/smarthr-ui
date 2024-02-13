import React, { ReactNode, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { tv } from 'tailwind-variants'

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

const tdCheckbox = tv({
  slots: {
    inner: 'shr-absolute shr-inset-0 [&:not(:has([disabled]))]:shr-cursor-pointer',
    wrapper: 'shr-relative shr-w-[theme(fontSize.base)] [&]:shr-p-0.75',
  }
});

export const TdCheckbox = forwardRef<HTMLInputElement, Omit<CheckBoxProps, keyof Props> & Props>(
  ({ 'aria-labelledby': ariaLabelledby, children, className, ...others }, ref) => {
    const { wrapperStyle, innerStyle } = useMemo(() => {
      const { wrapper, inner } = tdCheckbox()
      return {
        wrapperStyle: wrapper({ className }),
        innerStyle: inner(),
      }
    }, [className])

    return (
      // Td に必要な属性やイベントは不要
      <Td className={wrapperStyle}>
        <Center as="label" className={innerStyle}>
          {/* 使う側で lint をかけるため無効化 */}
          {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute  */}
          <CheckBox {...others} ref={ref} aria-labelledby={ariaLabelledby} />
          {children && <VisuallyHiddenText>{children}</VisuallyHiddenText>}
        </Center>
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
const LabelCenter = styled(Center).attrs({ forwardedAs: 'label', verticalCentering: true })`
  position: absolute;
  inset: 0;

  &:not(:has([disabled])) {
    cursor: pointer;
  }
`
