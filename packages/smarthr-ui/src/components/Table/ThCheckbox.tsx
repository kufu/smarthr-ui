import React, { forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { CheckBox, Props as CheckBoxProps } from '../CheckBox'
import { Center } from '../Layout'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { Th } from './Th'

import type { DecoratorsType } from '../../types'

type Props = {
  decorators?: DecoratorsType<'checkAllInvisibleLabel'>
}

const CHECK_ALL_INVISIBLE_LABEL = 'すべての行を選択'

const thCheckbox = tv({
  slots: {
    inner: 'shr-absolute shr-inset-0 [&:not(:has([disabled]))]:shr-cursor-pointer',
    wrapper: 'shr-relative shr-w-[theme(fontSize.base)] [&]:shr-px-0.75',
    checkbox: '[&]:shr-block',
  },
})

export const ThCheckbox = forwardRef<HTMLInputElement, CheckBoxProps & Props>(
  ({ decorators, className, ...others }, ref) => {
    const { wrapperStyle, innerStyle, checkboxStyle } = useMemo(() => {
      const { wrapper, inner, checkbox } = thCheckbox()
      return {
        wrapperStyle: wrapper({ className }),
        innerStyle: inner(),
        checkboxStyle: checkbox(),
      }
    }, [className])

    return (
      // Th に必要な属性やイベントは不要
      <Th className={wrapperStyle}>
        <Center as="label" verticalCentering className={innerStyle}>
          <CheckBox {...others} ref={ref} className={checkboxStyle} />
          <VisuallyHiddenText>
            {decorators?.checkAllInvisibleLabel?.(CHECK_ALL_INVISIBLE_LABEL) ||
              CHECK_ALL_INVISIBLE_LABEL}
          </VisuallyHiddenText>
        </Center>
      </Th>
    )
  },
)
