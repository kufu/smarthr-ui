import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { CheckBox, Props as CheckBoxProps } from '../CheckBox'
import { Center } from '../Layout'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { Th as shrTh } from './Th'

import type { DecoratorsType } from '../../types'

type Props = {
  decorators?: DecoratorsType<'checkAllInvisibleLabel'>
}

const CHECK_ALL_INVISIBLE_LABEL = 'すべての行を選択'

export const ThCheckbox = forwardRef<HTMLInputElement, CheckBoxProps & Props>(
  ({ decorators, className, ...others }, ref) => {
    const theme = useTheme()
    return (
      // Th に必要な属性やイベントは不要
      <Th themes={theme} className={className}>
        <Label>
          {/* 使う側で lint をかけるため無効化 */}
          {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute  */}
          <CheckBox {...others} ref={ref} />
          <VisuallyHiddenText>
            {decorators?.checkAllInvisibleLabel?.(CHECK_ALL_INVISIBLE_LABEL) ||
              CHECK_ALL_INVISIBLE_LABEL}
          </VisuallyHiddenText>
        </Label>
      </Th>
    )
  },
)

const Th = styled(shrTh)<{ themes: Theme }>`
  ${({ themes: { fontSize, space } }) => css`
    position: relative;
    padding: ${space(0.75)};
    width: ${fontSize.M};
  `}
`
const Label = styled(Center).attrs({ as: 'label', verticalCentering: true })`
  position: absolute;
  inset: 0;

  &:not(:has([disabled])) {
    cursor: pointer;
  }
`
