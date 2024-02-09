import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { tv } from 'tailwind-variants'

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

const thCheckbox = tv({
  slots: {
    inner: 'shr-absolute shr-inset-0 [&:not(:has([disabled]))]:shr-cursor-pointer',
    wrapper: 'shr-relative shr-p-0.75 shr-w-[theme(fontSize.base)]',
  },
})

export const ThCheckbox = forwardRef<HTMLInputElement, CheckBoxProps & Props>(
  ({ decorators, className, ...others }, ref) => {
    const { wrapperStyle, innerStyle } = useMemo(() => {
      const { wrapper, inner } = thCheckbox()
      return {
        wrapperStyle: wrapper({className}),
        innerStyle: inner()
      }
    }, [className])

    return (
      // Th に必要な属性やイベントは不要
      <Th className={wrapperStyle}>
        <Center as="label" verticalCentering className={innerStyle}>
          {/* 使う側で lint をかけるため無効化 */}
          {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute  */}
          <CheckBox {...others} ref={ref} />
          <VisuallyHiddenText>
            {decorators?.checkAllInvisibleLabel?.(CHECK_ALL_INVISIBLE_LABEL) ||
              CHECK_ALL_INVISIBLE_LABEL}
          </VisuallyHiddenText>
        </Center>
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
const LabelCenter = styled(Center).attrs({ forwardedAs: 'label', verticalCentering: true })`
  position: absolute;
  inset: 0;

  &:not(:has([disabled])) {
    cursor: pointer;
  }
`
