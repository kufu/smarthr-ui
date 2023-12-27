import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Balloon } from '../Balloon'
import { CheckBox, Props as CheckBoxProps } from '../CheckBox'
import { Center } from '../Layout'

import { Th as shrTh } from './Th'

import type { DecoratorsType } from '../../types'

type Props = {
  decorators?: DecoratorsType<'checkAllInvisibleLabel'>
}

const CHECK_ALL_INVISIBLE_LABEL = 'すべての行を選択'

export const ThCheckbox = forwardRef<HTMLInputElement, CheckBoxProps & Props>(
  ({ decorators, className, ...others }, ref) => {
    const theme = useTheme()
    const checkAllInvisibleLabel =
      decorators?.checkAllInvisibleLabel?.(CHECK_ALL_INVISIBLE_LABEL) || CHECK_ALL_INVISIBLE_LABEL
    return (
      // Th に必要な属性やイベントは不要
      <Th themes={theme} className={className}>
        <Label>
          <Balloon horizontal="left" vertical="middle">
            <p className="shr-p-0.5">{checkAllInvisibleLabel}</p>
          </Balloon>
          {/* 使う側で lint をかけるため無効化 */}
          {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute  */}
          <CheckBox {...others} ref={ref} />
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

const Label = styled(Center).attrs({ forwardedAs: 'label', verticalCentering: true })`
  position: absolute;
  inset: 0;

  &:not(:has([disabled])) {
    cursor: pointer;
  }

  .smarthr-ui-Balloon {
    position: absolute;
    left: 38px;
    transform: translate(0, 1px);
    clip-path: inset(100%);
  }

  &:has(input:hover, input:focus, input:focus-visible) > .smarthr-ui-Balloon {
    clip-path: none;
  }
`
