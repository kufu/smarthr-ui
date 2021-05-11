import React, { HTMLAttributes, VFC } from 'react'
import styled, { css } from 'styled-components'

import { CheckBox, Props as CheckBoxProps } from '../CheckBox'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

type Props = CheckBoxProps & {
  label: string
  lineHeight?: number
}

export const CheckBoxLabel: VFC<Props & ElementProps> = ({
  label,
  lineHeight = 1.5,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper className={`${className} ${classNames.wrapper}`}>
      <Label className={`${props.disabled ? 'disabled' : ''} ${classNames.label}`} themes={theme}>
        <CheckBox {...props} />
        <Txt className={classNames.text} lineHeight={lineHeight} themes={theme}>
          {label}
        </Txt>
      </Label>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-block;
`
const Label = styled.label<{ themes: Theme }>`
  ${({ themes }) => {
    const { color } = themes

    // 複数行テキストに対応させるため flex-start にする
    return css`
      display: flex;
      align-items: flex-start;
      color: ${color.TEXT_BLACK};
      cursor: pointer;

      &.disabled {
        color: ${color.TEXT_DISABLED};
        cursor: default;
        pointer-events: none;
      }
    `
  }}
`
const Txt = styled.span<{ themes: Theme; lineHeight: number }>`
  ${({ themes, lineHeight }) => {
    const { fontSize, spacingByChar } = themes

    // checkbox と text の位置がずれるため、line-height 分を調整する疑似要素を作る
    return css`
      margin: 0 0 0 ${spacingByChar(0.5)};
      font-size: ${fontSize.pxToRem(fontSize.TALL)};
      line-height: ${lineHeight};
      &::before {
        content: '';
        display: block;
        height: 0;
        width: 0;
        margin-top: calc((1 - ${lineHeight}) * 0.3em);
      }
    `
  }}
`
